# test-task-fullstack

Технології

-Frontend: React, Redux Toolkit, TypeScript, Material-UI (MUI), React Router, react-slick

-Backend: Node.js, Express.js, MongoDB, Mongoose, JWT для аутентифікації

Інше: Зберігання зображень локально (uploads), CORS, dotenv
________________________________________________________________________________
Як запустити проект

1) Склонуйте репозиторій:

git clone https://github.com/bohdam1/test-task-fullstack.git
cd test-task-fullstack


2) Перейдіть у папку сервер і створіть .env:

cd server
touch .env


3) Додайте у .env ваші дані:

MONGO_URI=mongodb+srv://bohdan:lopsterua@cluster0.j9dtkgz.mongodb.net/adsboard?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=supersecretkey


4) Встановіть залежності та запустіть проект:

npm install
npm run dev


Сервер буде на http://localhost:5000

React-клієнт на http://localhost:3000

Зображення зберігаються локально в папці uploads.
