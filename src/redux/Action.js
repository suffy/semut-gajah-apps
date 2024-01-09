export const LoginAction = (value, tipe) => dispatch => {
  return dispatch({ type: "SET_LOGIN", inputValue: value, inputType: tipe })
}

export const UserAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_USER', inputValue: value, inputType: tipe });
};

export const PlusOrderAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'PLUS_ORDER', inputValue: value, inputType: tipe });
};

export const MinusOrderAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'MINUS_ORDER', inputValue: value, inputType: tipe });
};

export const ProductAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_PRODUCT', inputValue: value, inputType: tipe });
};

export const SubsAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_SUBSCRIBE', inputValue: value, inputType: tipe });
};

export const BannerAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_BANNER', inputValue: value, inputType: tipe });
};

export const TopSpenderAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_TOP_SPENDER', inputValue: value, inputType: tipe });
};

export const VoucherAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_VOUCHER', inputValue: value, inputType: tipe });
};

export const ShoppingCartAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_SHOPPING_CART', inputValue: value, inputType: tipe });
};

export const OrderAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_ORDER', inputValue: value, inputType: tipe });
};

export const RatingAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_RATING', inputValue: value, inputType: tipe });
};

export const NotifAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_NOTIF', inputValue: value, inputType: tipe });
};

export const ComplaintAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_COMPLAINT', inputValue: value, inputType: tipe });
};

export const HelpCareAction = (value, tipe) => dispatch => {
  return dispatch({ type: 'SET_HELP_CARE', inputValue: value, inputType: tipe });
};