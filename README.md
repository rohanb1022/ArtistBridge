# 🎨 ArtistBridge

ArtistBridge is a full-stack web application that connects **event organizers** with talented **artists** across India. Organizers can discover, request, and book artists for events, while artists can manage requests, maintain profiles, and build visibility.

![image](https://github.com/user-attachments/assets/67dc881e-d994-4beb-93c8-37c4b3bdd5a8)

## 🚀 Features

### For Artists
- Secure signup/login with JWT authentication
- Profile creation with genre, bio, and category
- Manage incoming requests from organizers
- Accept/reject booking requests
- View confirmed bookings

### For Organizers
- Signup/login with secure authentication
- Browse artists based on category and genre
- Send booking requests to artists
- View status of sent requests

### Shared
- Protected routes for artists and organizers
- Interactive landing page with animations (GSAP/Framer Motion)
- Mobile responsive UI (fully optimized)
- Cookie-based JWT token handling with middleware protection

---

## 🛠 Tech Stack

| Frontend       | Backend           | Database     | Tools & Libraries     |
|----------------|-------------------|--------------|------------------------|
| Next.js (App Router) | Node.js, Express.js | PostgreSQL via Prisma ORM | Tailwind CSS, Framer Motion, GSAP |
| TypeScript     | REST APIs         | Prisma ORM   | Axios, Lucide React Icons |

---

## ⚙️ Setup Instructions

1. **Clone the repo**
```bash
git clone https://github.com/rohanb1022/ArtistBridge.git
cd ArtistBridge
````

2. **Install dependencies**

```bash
npm install
```

3. **Setup `.env`**

```env
DATABASE_URL=your_postgres_db_url
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. **Prisma Setup**

```bash
npx prisma generate
npx prisma migrate dev
```

5. **Run the development server**

```bash
npm run dev
```

---

## 📁 Folder Structure

```
/app
  └── api/
  └── artist/
  └── organizer/
  └── components/
  └── lib/
      └── axios.ts
      └── auth.ts
      └── withAuth.ts
/middleware.ts
/sections
  └── artist/
  └── organizer/
```

---

## 🧠 Future Enhancements

* ✅ Real-time booking status updates using **Supabase or WebSockets**
* ✅ Notifications via email or in-app
* ✅ Artist rating & reviews
* ✅ Payment integration for advance booking

---

## 📸 Screenshots

### View Bookings
![image](https://github.com/user-attachments/assets/4366f89e-b050-42d9-a1c0-2ecffe172d86)

---

### Pending Request
![image](https://github.com/user-attachments/assets/917b0be3-9030-411c-a14e-f7cabd705739)

---

### Home page of Artist
![image](https://github.com/user-attachments/assets/14ffaebf-fb62-4b84-9632-ca6d87fed632)




---

## 🧑‍💻 Developed By

Rohan Bhangale
VESIT, Mumbai
📧 [rohanbhangale25@gmail.com](mailto:rohanbhangale25@gmail.com)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
