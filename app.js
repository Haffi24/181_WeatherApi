const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/lokasi", async (req, res) => {
    
    const kota = req.query.search || "jakarta";
    const apiKey = "OvSSow8pa05d6k4j8ivy";
    
    
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(kota)}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        
        if (data.features.length === 0) {
            return res.status(404).json({ message: "Lokasi tidak ditemukan" });
        }

        const feature = data.features[0];
        
    
        const longitude = feature.geometry.coordinates[0];
        const latitude = feature.geometry.coordinates[1];

       
        let negara = "-";
        let provinsi = "-";
        let kecamatan = "-";

        
        if (feature.context) {
            feature.context.forEach(item => {
                if (item.id.startsWith("country")) negara = item.text;
                if (item.id.startsWith("region")) provinsi = item.text;
                if (item.id.startsWith("county") || item.id.startsWith("subregion")) kecamatan = item.text;
            });
        }

        res.json({
            lokasi: feature.text,
            negara: negara,
            provinsi: provinsi,
            kecamatan: kecamatan,
            longitude: longitude,
            latitude: latitude,

        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});