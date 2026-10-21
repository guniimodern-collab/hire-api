# Hire API — İşə qəbul sistemi

Vakansiya, namizəd, müraciət və müsahibə idarəsi üçün REST API.
Texnologiyalar: **Bun, Express, MongoDB, Mongoose, JWT**.

## Quraşdırma

1. Layihəni yükləyin və qovluğa daxil olun.
2. Paketləri quraşdırın:
   ```
   bun install
   ```
3. `.env.example` faylını kopyalayıb `.env` adı ilə saxlayın və dəyərləri doldurun:
   ```
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/hire-api
   JWT_SECRET=istənilən_gizli_söz
   ```
4. (İstəyə bağlı) Nümunə data yükləyin:
   ```
   bun src/seed.js
   ```
5. Serveri başladın:
   ```
   bun run start
   ```
   Server `http://localhost:3000` ünvanında işləyir.

## Rollar

- **hr**: vakansiya yaradır/dəyişir/silir, müraciətlərə baxır, status dəyişir, müsahibə təyin edir.
- **candidate**: profilini doldurur, vakansiyalara müraciət edir, öz müraciətlərinə baxır.

Qeydiyyatda `role` verilməsə, `candidate` olur. Qorunan route-lara `Authorization: Bearer <token>` başlığı ilə müraciət olunur.

## Modellər

User, Candidate, Vacancy, Application, Interview.
Eyni namizəd eyni vakansiyaya təkrar müraciət edə bilməz (`409`).

## Endpointlər

| Metod | Ünvan | Rol | Təsvir |
|---|---|---|---|
| POST | /api/auth/register | hamı | Qeydiyyat |
| POST | /api/auth/login | hamı | Giriş |
| GET | /api/auth/me | giriş etmiş | Cari istifadəçi |
| GET | /api/vacancies | hamı | Siyahı (axtarış, filtr, pagination) |
| GET | /api/vacancies/:id | hamı | Bir vakansiya |
| POST | /api/vacancies | hr | Yeni vakansiya |
| PUT | /api/vacancies/:id | hr | Dəyişmək |
| DELETE | /api/vacancies/:id | hr | Silmək |
| GET | /api/candidates/me | candidate | Öz profili |
| PUT | /api/candidates/me | candidate | Profili yeniləmək |
| GET | /api/candidates | hr | Namizədlər (filtr, pagination) |
| POST | /api/applications | candidate | Müraciət etmək |
| GET | /api/applications/my | candidate | Öz müraciətləri |
| GET | /api/applications | hr | Bütün müraciətlər (filtr, pagination) |
| PATCH | /api/applications/:id/status | hr | Status dəyişmək |
| POST | /api/interviews | hr | Müsahibə təyin etmək |
| GET | /api/interviews | hr | Müsahibələr |
| PATCH | /api/interviews/:id/result | hr | Nəticəni yazmaq |

## Axtarış, filtr, pagination

- Vakansiyalar: `GET /api/vacancies?search=back&city=baku&status=open&minSalary=1000&page=1&limit=10`
- Müraciətlər: `GET /api/applications?status=applied&vacancy=<id>&page=1&limit=10`
- Namizədlər: `GET /api/candidates?skill=node&minExperience=2`

Müraciət statusları: `applied`, `reviewing`, `interview`, `accepted`, `rejected`.

## HTTP status kodları

`200` uğurlu, `201` yaradıldı, `400` yanlış məlumat, `401` token yoxdur/yanlışdır, `403` icazə yoxdur, `404` tapılmadı, `409` təkrar müraciət.

## Nümunə hesablar (seed işlədildikdən sonra)

- HR: `hr@test.com` / `123456`
- Namizəd: `nezrin@test.com` / `123456`

## Postman

`hire-api.postman_collection.json` faylını Postman-a import edin.
