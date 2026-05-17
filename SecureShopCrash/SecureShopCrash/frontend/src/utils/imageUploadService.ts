import { toast } from "react-toastify";
import { supabase } from "./supabase";
import { api } from "./axiosConfig";
import { v4 as uuidv4 } from "uuid";

export interface UploadResult {
  url: string;
  path: string;
  bucket: string;
}

interface UploadOptions {
  bucket?: string;
  folder?: string;
}

const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:12345/api").replace(
  /\/api\/?$/,
  ""
);

function toAbsoluteUrl(url: string): string {
  if (url.startsWith("http")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
}

class ImageUploadService {
  private defaultBucket = "products";

  async uploadImage(
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      this.validateFile(file);

      const folder = options.folder ?? options.bucket ?? "general";

      // Prefer backend upload (no Supabase signature issues)
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        const response = await api.post<{ url: string }>("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const absoluteUrl = toAbsoluteUrl(response.data.url);
        return {
          url: absoluteUrl,
          path: response.data.url,
          bucket: "local",
        };
      } catch (backendError) {
        console.warn("Backend upload failed, trying Supabase:", backendError);
      }

      const bucket = options.bucket ?? this.defaultBucket;
      const fileExt = file.name.split(".").pop();
      const fileName = folder
        ? `${folder}/${uuidv4()}.${fileExt}`
        : `${uuidv4()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw new Error(`Upload failed: ${error.message}`);

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path,
        bucket,
      };
    } catch (error) {
      const message = (error as Error).message || "Tải ảnh lên thất bại";
      toast.error(message);
      throw error;
    }
  }

  async uploadMultipleImages(
    files: File[],
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file, options));
    return Promise.all(uploadPromises);
  }

  /**
   * Best-effort cleanup of a remote image. Failures are logged only — never shown to the user,
   * because the new image is already saved successfully.
   */
  async deleteImage(pathOrUrl: string, bucket?: string): Promise<void> {
    if (!pathOrUrl?.trim()) return;

    // Backend-hosted files are not removed here (no delete API yet).
    if (pathOrUrl.includes("/api/files/")) {
      return;
    }

    // Only attempt Supabase when the URL clearly points at Supabase storage.
    if (!pathOrUrl.includes("supabase.co") && !pathOrUrl.startsWith("http")) {
      return;
    }

    const resolvedBucket =
      bucket ?? this.extractBucketFromUrl(pathOrUrl) ?? this.defaultBucket;
    const resolvedPath = this.getPathFromUrl(pathOrUrl);

    if (!resolvedPath) {
      console.warn("Skip delete: could not resolve storage path from", pathOrUrl);
      return;
    }

    try {
      const { error } = await supabase.storage
        .from(resolvedBucket)
        .remove([resolvedPath]);

      if (error) {
        console.warn("Old image cleanup skipped:", error.message);
      }
    } catch (error) {
      console.warn("Old image cleanup skipped:", error);
    }
  }

  async deleteMultipleImages(
    pathsOrUrls: string[],
    bucket?: string
  ): Promise<void> {
    const deletePromises = pathsOrUrls.map((path) =>
      this.deleteImage(path, bucket)
    );
    await Promise.all(deletePromises);
  }

  private validateFile(file: File): void {
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB");
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, and WebP images are allowed");
    }
  }

  getPathFromUrl(urlOrPath: string): string {
    if (!urlOrPath.startsWith("http")) return urlOrPath;
    try {
      const url = new URL(urlOrPath);
      const parts = url.pathname.split("/object/public/");
      return parts.length > 1 ? parts[1].split("/").slice(1).join("/") : "";
    } catch {
      return "";
    }
  }

  private extractBucketFromUrl(url: string): string | null {
    try {
      const match = url.match(/\/object\/public\/([^/]+)\//);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }
}

export const imageUploadService = new ImageUploadService();
