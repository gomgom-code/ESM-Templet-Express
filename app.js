import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';

// (선택) 보안/크로스 도메인 기본 설정
import helmet from 'helmet';
import cors from 'cors';

// (선택) .env 사용 시
// 포트/비밀키 같은 환경별 값은 코드에 박지 말고 .env로 분리
import dotenv from 'dotenv';
dotenv.config();

// 라우터 (예: WebStorm 기본 템플릿 기준)
import indexRouter from'./routes/index.js';
import usersRouter from'./routes/users.js';

// Express 앱 생성
const app = express();

// (선택) 뷰 엔진을 실제로 쓴다면 유지, API 서버만 할 거면 제거 가능
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'pug');

// 공통 미들웨어
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), "public")));

// (권장) 보안 헤더 추가 + CORS 허용(운영 시 도메인 제한)
app.use(helmet());
app.use(cors());

// 라우터 장착
app.use("/", indexRouter);
app.use("/users", usersRouter);

// ─────────────── 404 핸들링 ───────────────
// 등록되지 않은 모든 경로는 404 에러로 next()
app.use((req, res, next) => {
    next(createError(404));
});

// ─────────────── 에러 핸들러(API용 JSON) ───────────────
// Express는 "4개 인자(err, req, res, next)" 시그니처를 에러 핸들러로 인식합니다.
app.use((err, req, res, next) => {
    // 서버 콘솔에 에러 기록
    console.error(`[ERROR] ${err?.message}`);
    if (err?.stack) console.error(err.stack);

    const status = err?.status || 500;

    // API 서버이므로 렌더링 대신 JSON으로 응답
    res.status(status).json({
        ok: false,
        error: {
            message: err?.message || 'Internal Server Error',
            // 개발 모드에서만 스택 노출 (보안상 운영에서는 숨김)
            stack: req.app.get('env') === 'development' ? err?.stack : undefined,
        },
        timestamp: new Date().toISOString(),
    });
});

export default app;