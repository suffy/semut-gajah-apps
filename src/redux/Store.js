import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import Reducer from "./Reducer";

const middleware = [thunk]
const initialState = {}

const Store = createStore(Reducer, initialState, applyMiddleware(...middleware))

export default Store