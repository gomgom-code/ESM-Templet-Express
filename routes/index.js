// routes/index.js  (ESM 버전)
import { Router } from 'express';

const router = Router();

/* GET home page. */
router.get('/', (req, res) => {
    // 뷰를 쓰지 않는 API 서버라면 res.json(...)으로 바꿔도 됩니다.
    res.render('index', { title: 'Express' });
});

export default router;
