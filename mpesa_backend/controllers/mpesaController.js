const axios = require('axios');

// Validation helper
function validatePhone(phone) {
    const cleaned = String(phone).replace(/\D/g, '');

    if (cleaned.startsWith('2547') && cleaned.length === 12) {
        return cleaned;
    }

    if (cleaned.startsWith('7') && cleaned.length === 9) {
        return `254${cleaned}`;
    }

    if (cleaned.startsWith('07') && cleaned.length === 10) {
        return `254${cleaned.slice(1)}`;
    }

    return null;
}

function validateAmount(amount) {
    const value = Number(amount);
    return Number.isSafeInteger(value) && value >= 1 ? value : null;
}

async function stkPush(req, res) {
    try {
        const { phone, amount } = req.body;
        const shortCode = process.env.SHORTCODE;
        const passkey = process.env.PASSKEY;
        const callbackUrl = (process.env.CALLBACK_URL || '').replace(/\/$/, '');
        const mpesaBaseUrl = process.env.MPESA_API_URL || 'https://sandbox.safaricom.co.ke';

        if (!phone || !amount) {
            return res.status(400).json({
                error: 'phone and amount are required',
                details: 'Please provide phone number and amount'
            });
        }

        const validatedPhone = validatePhone(phone);
        if (!validatedPhone) {
            return res.status(400).json({
                error: 'Invalid phone number format',
                details: 'Phone must be Kenyan format (254712345678, 0712345678 or 712345678)'
            });
        }

        const amountNum = validateAmount(amount);
        if (!amountNum) {
            return res.status(400).json({
                error: 'Invalid amount',
                details: 'Amount must be a whole number of at least 1 KSH'
            });
        }

        if (!shortCode || !passkey || !callbackUrl) {
            console.error('Missing M-Pesa configuration:', {
                shortCode: !!shortCode,
                passkey: !!passkey,
                callbackUrl: !!callbackUrl
            });
            return res.status(500).json({
                error: 'Server configuration error',
                details: 'Missing SHORTCODE, PASSKEY, or CALLBACK_URL in configuration'
            });
        }

        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

        const payload = {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amountNum,
            PartyA: validatedPhone,
            PartyB: shortCode,
            PhoneNumber: validatedPhone,
            CallBackURL: `${callbackUrl}/callback`,
            AccountReference: 'POS_System',
            TransactionDesc: 'Payment'
        };

const response = await axios.post(
            `${mpesaBaseUrl}/mpesa/stkpush/v1/processrequest`,
            payload,
            {
                headers: { Authorization: 'Bearer ' + req.token },
                timeout: 10000
            }
        );

        console.log('STK Push successful:', response.data);
        return res.json(response.data);
    } catch (error) {
        console.error('STK Push Error:', error.response?.data || error.message);
        return res.status(error.response?.status || 400).json({
            error: 'STK Push failed',
            details: error.response?.data?.errorMessage || error.message
        });
    }
}

function CallBackURL(req, res) {
    try {
        const result = req.body;
        console.log('=== M-Pesa Callback Received ===');
        console.log(JSON.stringify(result, null, 2));
        console.log('================================');

        return res.json({ message: 'Received', status: 'success' });
    } catch (error) {
        console.error('Callback processing error:', error);
        return res.status(500).json({ error: 'Failed to process callback' });
    }
}

function ValidationURL(req, res) {
    try {
        const result = req.body;
        console.log('=== M-Pesa Validation Received ===');
        console.log(JSON.stringify(result, null, 2));
        console.log('=================================');

        return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    } catch (error) {
        console.error('Validation processing error:', error);
        return res.status(500).json({ error: 'Failed to process validation' });
    }
}

module.exports = {
    stkPush,
    CallBackURL,
    ValidationURL,
    validatePhone,
    validateAmount
};

