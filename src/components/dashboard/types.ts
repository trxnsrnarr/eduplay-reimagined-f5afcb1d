export type Profile = {
  id: string;
  display_name: string | null;
  primary_role: "siswa" | "creator" | "parent";
  jenjang: string | null;
  kelas: string | null;
  jurusan: string | null;
  tujuan_belajar: string | null;
  bidang: string | null;
  pengalaman: string | null;
  institusi: string | null;
  nama_anak: string | null;
  jenjang_anak: string | null;
  student_invite_code: string | null;
};