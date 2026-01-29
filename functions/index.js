const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { defineSecret } = require("firebase-functions/params");

const GOOGLE_MAPS_API_KEY = defineSecret("GOOGLE_MAPS_API_KEY");

const corsHandler = cors({
  origin: (origin, cb) => {
    // Permitir chamadas sem origin (curl/postman) e navegação direta
    if (!origin) return cb(null, true);

    // DEV localhost (qualquer porta)
    if (/^http:\/\/localhost:\d+$/.test(origin)) return cb(null, true);

    // Domínio FlutterFlow (ajuste se necessário)
    const allowed = [
      "https://app-viagens-leomoraes.flutterflow.app",
    ];
    if (allowed.includes(origin)) return cb(null, true);

    return cb(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

/* ============================================================
 * PLACES AUTOCOMPLETE (JÁ EXISTENTE)
 * ============================================================ */
exports.placesAutocomplete = onRequest(
  { region: "southamerica-east1", secrets: [GOOGLE_MAPS_API_KEY] },
  (req, res) => {
    // Preflight
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    corsHandler(req, res, async () => {
      try {
        const input = req.query.input;
        const languageCode = req.query.languageCode || "pt-BR";
        const limit = Number(req.query.limit || 5);

        if (!input || String(input).trim().length < 2) {
          return res
            .status(400)
            .json({ ok: false, error: "input is required (min 2 chars)" });
        }

        const url = "https://places.googleapis.com/v1/places:autocomplete";
        const body = {
          input: String(input),
          languageCode: String(languageCode),
        };

        const r = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY.value(),
            "X-Goog-FieldMask":
              "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
          },
          body: JSON.stringify(body),
        });

        const data = await r.json();
        if (!r.ok) {
          return res.status(r.status).json({ ok: false, googleError: data });
        }

        const items = (data.suggestions || [])
          .map((s) => s?.placePrediction)
          .filter(Boolean)
          .map((p) => ({
            description: p?.text?.text ?? "",
            place_id: p?.placeId ?? "",
          }))
          .filter((x) => x.description && x.place_id)
          .slice(0, limit);

        return res.status(200).json({ ok: true, items });
      } catch (e) {
        return res.status(500).json({ ok: false, error: String(e) });
      }
    });
  }
);

/* ============================================================
 * PLACES DETAILS (NOVO — PASSO B2)
 * ============================================================ */
exports.placesDetails = onRequest(
  { region: "southamerica-east1", secrets: [GOOGLE_MAPS_API_KEY] },
  (req, res) => {
    // Preflight
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    corsHandler(req, res, async () => {
      try {
        const placeId = String(req.query.placeId || "").trim();
        const languageCode = String(req.query.languageCode || "pt-BR").trim();

        if (!placeId) {
          return res
            .status(400)
            .json({ ok: false, error: "placeId is required" });
        }

        const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(
          placeId
        )}?languageCode=${encodeURIComponent(languageCode)}`;

        const r = await fetch(url, {
          method: "GET",
          headers: {
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY.value(),
            // FieldMask é OBRIGATÓRIO para receber latitude/longitude
            "X-Goog-FieldMask": "location,formattedAddress,displayName",
          },
        });

        const data = await r.json();
        if (!r.ok) {
          return res.status(r.status).json({ ok: false, googleError: data });
        }

        return res.status(200).json({
          ok: true,
          location: data.location, // { latitude, longitude }
          address: data.formattedAddress ?? null,
          name: data.displayName?.text ?? null,
        });
      } catch (e) {
        return res.status(500).json({ ok: false, error: String(e) });
      }
    });
  }
);
