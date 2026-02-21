import express from 'express'
import { subscribe, unsubscribe } from '../controllers/subscription.controller.js'

const subscriptionRouter = express.Router();

subscriptionRouter.post("/subscribe", subscribe)
subscriptionRouter.post("/unsubscribe", unsubscribe) 

export default subscriptionRouter;
