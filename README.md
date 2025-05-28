# 1. Tailwind CSS 설치
Tailwind 관련 패키지를 설치합니다:
```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

# 2. tailwind.config.js 설정
npx tailwindcss init -p까지 진행하면 tailwind.config.js 파일 생성됩니다. 
tailwind.config.js 파일을 열고, 아래와 같이 content 경로를 수정합니다:
```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

# Tailwind 디렉티브 추가
src/index.css 또는 src/App.css 파일 상단에 아래 세 줄을 추가합니다:
```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

# 실행
실행해서 정상적으로 작동한다면 설치 완료된 겁니다.
```
npm start
```

# 만약 오류가 발생할 경우
로그 보시고 검색해보시면 되겠습니다만, 제가 겪었던 오류 간단히 설명하고 해결방법 남기겠습니다. 
전 npx tailwindcss init -p 할 때
```
'tailwind' is not recognized as an internal or external command,
operable program or batch file.
```
오류가 발생했었습니다. 
찾아보니 설치 버전 오류라고 합니다. 그래서 
```
https://ohtanja.tistory.com/171
``` 
이 tistory 들어가서 지침대로 설치했더니 깔렸었습니다. 
