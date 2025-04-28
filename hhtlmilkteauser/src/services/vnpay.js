import queryString from 'query-string';
import dateFormat from 'dateformat';

// VNPay Configuration
const config = {
  vnp_TmnCode: "56UCDDH9",
  vnp_HashSecret: "Q0F3L76CZQRT78VXLIYMN93AE5R033LB",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_ReturnUrl: "http://localhost:3000/checkoutresult-vnpay"
};

// Sort object by key
const sortObject = (obj) => {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
};

// Create payment URL
export const createPaymentUrl = async (orderInfo) => {
  try {
    const date = new Date();
    const createDate = dateFormat(date, 'yyyymmddHHmmss');
    // Tạo mã giao dịch duy nhất bằng cách kết hợp timestamp và số ngẫu nhiên
    const orderId = dateFormat(date, 'HHmmss') + Math.floor(Math.random() * 1000);
    
    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: config.vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo.orderInfo || 'Thanh toan don hang',
      vnp_OrderType: 'other',
      vnp_Amount: Math.round(orderInfo.amount * 100),
      vnp_ReturnUrl: config.vnp_ReturnUrl,
      vnp_IpAddr: orderInfo.ipAddr || '127.0.0.1',
      vnp_CreateDate: createDate,
      vnp_BankCode: orderInfo.bankCode || 'NCB',
      vnp_ExpireDate: dateFormat(new Date(date.getTime() + 15 * 60000), 'yyyymmddHHmmss') // Thời gian hết hạn là 15 phút
    };

    // Sort params
    const sortedParams = sortObject(vnpParams);
    
    // Create hash
    const signData = queryString.stringify(sortedParams, { encode: false });
    const hmac = require('crypto').createHmac('sha512', config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    // Add signed to params
    vnpParams['vnp_SecureHash'] = signed;
    
    // Create URL
    const vnpUrl = config.vnp_Url + '?' + queryString.stringify(vnpParams, { encode: true });
    
    return {
      success: true,
      url: vnpUrl,
      orderId: orderId
    };
  } catch (error) {
    console.error('VNPay Error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Verify return URL
export const verifyReturnUrl = (vnpParams) => {
  try {
    const secureHash = vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHash'];
    delete vnpParams['vnp_SecureHashType'];

    const sortedParams = sortObject(vnpParams);
    const signData = queryString.stringify(sortedParams, { encode: false });
    const hmac = require('crypto').createHmac('sha512', config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    return secureHash === signed;
  } catch (error) {
    console.error('VNPay Verification Error:', error);
    return false;
  }
}; 