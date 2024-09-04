import {app} from './app';

const port = process.env.PORT || 5000;

const startApp = async () => {
    app.listen(port, () => {
        console.log(`App is running on port ${port}`);
    });
}

startApp();