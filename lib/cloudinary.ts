export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "etsy-manager");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/gnmhhmxk/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  console.log(data);

  if (!response.ok) {
    throw new Error(
      data.error?.message || "이미지 업로드 실패"
    );
  }

  return data.secure_url;
}


export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", "etsy-manager");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/gnmhhmxk/auto/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  console.log(data);

  if (!response.ok) {
    throw new Error(
      data.error?.message || "파일 업로드 실패"
    );
  }

  return data.secure_url;
}