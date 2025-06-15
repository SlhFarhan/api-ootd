const { Ootd } = require('../models');
const fs = require('fs');

// Fungsi untuk mendapatkan semua OOTD
exports.getAllOotds = async (req, res) => {
    try {
        const ootds = await Ootd.findAll({
            order: [['createdAt', 'DESC']]
        });
        // Create a full URL for the image
        const ootdsWithImageUrl = ootds.map(ootd => {
            return {
                ...ootd.toJSON(),
                imageUrl: `${process.env.BASE_URL}/uploads/${ootd.imageId}`
            }
        });
        res.send(ootdsWithImageUrl);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi untuk membuat OOTD baru
exports.createOotd = async (req, res) => {
    try {
        const { namaOutfit, deskripsi } = req.body;
        
        if (!req.file) {
            return res.status(400).send({ message: "Gambar harus di-upload." });
        }

        const newOotd = await Ootd.create({
            namaOutfit,
            deskripsi,
            imageId: req.file.filename, // Save only the filename
            userId: req.userId
        });
        res.status(201).send(newOotd);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi untuk mengupdate OOTD
exports.updateOotd = async (req, res) => {
    try {
        const ootd = await Ootd.findByPk(req.params.id);
        if (!ootd) {
            return res.status(404).send({ message: "OOTD not found" });
        }

        if (ootd.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden: You don't own this OOTD" });
        }
        
        let imageId = ootd.imageId;
        if (req.file) {
            // Delete old image if a new one is uploaded
            fs.unlink(`uploads/${ootd.imageId}`, (err) => {
                if (err) console.error("Gagal menghapus file gambar lama:", err);
            });
            imageId = req.file.filename;
        }
        
        const { namaOutfit, deskripsi } = req.body;
        await ootd.update({
            namaOutfit: namaOutfit || ootd.namaOutfit,
            deskripsi: deskripsi || ootd.deskripsi,
            imageId: imageId
        });
        res.send({ message: "OOTD updated successfully!", ootd });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi untuk menghapus OOTD
exports.deleteOotd = async (req, res) => {
    try {
        const ootd = await Ootd.findByPk(req.params.id);
        if (!ootd) {
            return res.status(404).send({ message: "OOTD not found" });
        }
        if (ootd.userId !== req.userId) {
            return res.status(403).send({ message: "Forbidden" });
        }

        // Hapus file gambar dari server
        fs.unlink(`uploads/${ootd.imageId}`, (err) => {
            if (err) console.error("Gagal menghapus file gambar:", err);
        });
        
        await ootd.destroy();
        res.send({ message: "OOTD deleted successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Fungsi get by ID
exports.getOotdById = async (req, res) => {
    try {
        const ootd = await Ootd.findByPk(req.params.id);
        if (!ootd) {
            return res.status(404).send({ message: "OOTD not found" });
        }
         const ootdWithImageUrl = {
            ...ootd.toJSON(),
            imageUrl: `${process.env.BASE_URL}/uploads/${ootd.imageId}`
        }
        res.send(ootdWithImageUrl);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};