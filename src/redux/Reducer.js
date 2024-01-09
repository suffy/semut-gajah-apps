import {combineReducers} from 'redux';

const stateUser = {
  dataUser: [],
  customer_code: '',
  isLogin: false,
  province: 'Pilih Provinsi',
  city: 'Kabupaten/Kota',
  district: 'Kecamatan',
  subdistrict: 'Kelurahan',
  postcode: 'Kode Pos',
  other_province: 'Pilih Provinsi',
  other_city: 'Kota',
  other_district: 'Kecamatan',
  other_subdistrict: 'Kelurahan',
  other_postcode: 'Kode Pos',
  codeUser: '',
  nama: '',
  phone: '',
  token: '',
  province2: 'Pilih Provinsi',
  city2: 'Kota',
  district2: 'Kecamatan',
  subdistrict2: 'Kelurahan',
  postcode2: 'Kode Pos',
  other_province2: 'Pilih Provinsi',
  other_city2: 'Kota',
  other_district2: 'Kecamatan',
  other_subdistrict2: 'Kelurahan',
  other_postcode2: 'Kode Pos',
  chat: '',
  alamat: {},
  credit: '',
};

const stateProduct = {
  product: [],
};
const stateSubscribe = {
  user_id: '',
  product_id: '',
  qty: 0,
  time: 'week',
  notes: '',
  status: '',
  item: [],
  listDataSubscribe: [],
};

const stateBanner = {
  id: '',
  images: '',
  code: '',
  type: '',
  percent: '',
  nominal: '',
  category: '',
  termandcondition: '',
  min_transaction: '',
  max_transaction: '',
  description: '',
  end_at: '',
};

const stateTopSpender ={
  id:'',
  title:'',
  description:'',
  banner:'',
  identity:'',
  filter:'',
  hadiah:'',
  rank_reward: [
    {
      id: '',
      top_spender_id: '',
      pos:'',
      nominal:'',
    }
  ],
}

const stateVoucher = {
  id: '',
  code: '',
  type: '',
  percent: '',
  nominal: '',
  category: '',
  termandcondition: '',
  min_transaction: '',
  max_transaction: '',
  description: '',
  end_at: '',
  rewardDetail: [],
};

const stateShoppingCart = {
  product_id: '',
  large_price: '',
  large_qty: '',
  large_unit: '',
  medium_price: '',
  medium_qty: '',
  medium_unit: '',
  small_price: '',
  small_qty: '1',
  small_unit: '',
  notes: '',
  total_price: '',
  item: [],
  promo: [],
  hasilPromoNotif: [],
  hasilPromo: [],
  hargaPromo: [],
  shop: [],
};

const stateListOrder = {
  id: '',
  status: '',
  created_at: '',
  invoice: '',
  delivery_service: '',
  delivery_time: '',
  delivery_track: '',
  delivery_fee: '',
  name: '',
  phone: '',
  address: '',
  kelurahan: '',
  kecamatan: '',
  kota: '',
  provinsi: '',
  kode_pos: '',
  payment_method: '',
  payment_total: '',
  payment_discount: '',
  data_item: [
    {
      id: '',
      qty: '',
      price: '',
      product: {
        id: '',
        name: '',
        image: '',
      },
    },
  ],
};

const stateRating = {
  id: '',
  payment_final: '',
  data_unreview: [
    {
      id: '',
      product_id: '',
      order_id: '',
      qty: '',
      total_price: '',
      product: {
        id: '',
        name: '',
        image: '',
        price_sell: '',
      },
    },
  ],
};

const stateNotification = {
  message: 0,
  notifMessage: [],
  subscribe: 0,
  notifSubscribe: [],
  newOrder: 0,
  notifNewOrder: '',
  orderConfirm: 0,
  notifOrderConfirm: '',
  paymentConfirm: 0,
  notifPaymentConfirm: '',
  deliveryProcess: 0,
  notifDeliveryProcess: '',
  orderComplete: 0,
  notifOrderComplete: '',
  orderCancel: 0,
  notifOrderCancel: '',
  refreshing: false,
  notifAllOrder: [],
  listDataSubscribe: [],
  listDataTransaction: [],
};

const stateComplaint = [
  {
    id: '',
    order_id: '',
    product_id: '',
    user_id: '',
    status: '',
    created_at: '',
    updated_at: '',
    order: {
      id: '',
      payment_total: '',
      created_at: '',
    },
    product: {
      id: '',
      name: '',
      image: '',
    },
  },
];

const stateHelpCare = [
  {
    id: '',
    name: '',
    description: '',
  },
];

function LoginReducer(state = stateUser, action) {
  switch (action.type) {
    case 'SET_LOGIN':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}

function ProductReducer(state = stateProduct, action) {
  switch (action.type) {
    case 'SET_PRODUCT':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}

function SubscribeReducer(state = stateSubscribe, action) {
  switch (action.type) {
    case 'SET_SUBSCRIBE':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    case 'PLUS_ORDER':
      return {
        ...state,
        qty: state.qty + 1,
      };
    case 'MINUS_ORDER':
      let totalOrder = 0;
      if (state.qty > 0) {
        totalOrder = state.qty - 1;
      }
      return {
        ...state,
        qty: totalOrder,
      };
    default:
      return state;
  }
}

function BannerReducer(state = stateBanner, action) {
  switch (action.type) {
    case 'SET_BANNER':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}
function TopSpenderReducer(state = stateTopSpender, action) {
  switch (action.type) {
    case 'SET_TOP_SPENDER':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}

function VoucherReducer(state = stateVoucher, action) {
  switch (action.type) {
    case 'SET_VOUCHER':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}

function ShoppingCartReducer(state = stateShoppingCart, action) {
  switch (action.type) {
    case 'SET_SHOPPING_CART':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}

function OrderReducer(state = stateListOrder, action) {
  switch (action.type) {
    case 'SET_ORDER':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}

function RatingReducer(state = stateRating, action) {
  switch (action.type) {
    case 'SET_RATING':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}

function NotifReducer(state = stateNotification, action) {
  switch (action.type) {
    case 'SET_NOTIF':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}

function ComplaintReducer(state = stateComplaint, action) {
  switch (action.type) {
    case 'SET_COMPLAINT':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}

function HelpReducer(state = stateHelpCare, action) {
  switch (action.type) {
    case 'SET_HELP_CARE':
      return {
        ...state,
        [action.inputType]: action.inputValue,
      };
    default:
      return state;
  }
}

const Reducer = combineReducers({
  LoginReducer,
  ProductReducer,
  SubscribeReducer,
  BannerReducer,
  VoucherReducer,
  ShoppingCartReducer,
  OrderReducer,
  RatingReducer,
  NotifReducer,
  ComplaintReducer,
  HelpReducer,
  TopSpenderReducer,
});

export default Reducer;
