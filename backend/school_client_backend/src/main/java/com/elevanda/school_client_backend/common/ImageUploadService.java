package com.elevanda.school_client_backend.common;

import com.cloudinary.Cloudinary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class ImageUploadService {

    private final Cloudinary cloudinary;

    public ImageUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }


    public String uploadImage(MultipartFile file) {
        try {
            Map upload = cloudinary.uploader().upload(file.getBytes(),
                    Map.of("folder", "ecommerce_products"));
            return upload.get("secure_url").toString();
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }
    }

    // Delete image from Cloudinary using the image URL
    public void deleteImage(String imageUrl) {
        try {
            if (imageUrl == null || imageUrl.isBlank()) return;

            // Extract public_id from the Cloudinary URL
            // Example URL: https://res.cloudinary.com/<cloud_name>/image/upload/v123456/ecommerce_products/filename.jpg
            String[] parts = imageUrl.split("/");
            String filenameWithExt = parts[parts.length - 1]; // filename.jpg
            String filename = filenameWithExt.substring(0, filenameWithExt.lastIndexOf('.')); // filename

            cloudinary.uploader().destroy("ecommerce_products/" + filename, Map.of());
        } catch (Exception e) {
            throw new RuntimeException("Image deletion failed", e);
        }
    }
}
