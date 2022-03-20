import express from 'express';
import cors from 'cors';
import { VideoController } from './adapters/controllers/video.controller';

const app = express();
const videoController = new VideoController();

app.use(cors());

app.get('/video', videoController.getVideo.bind(videoController));
app.listen(5000, () => console.log('Example app listening on port 5000!'));
