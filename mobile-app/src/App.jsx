import { useMemo, useState } from 'react';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

const initialTransactions = [
  { id: 1, phone: '254 712 345 678', amount: 'KSH 1,500', status: 'Success' },
  { id: 2, phone: '254 721 004 001', amount: 'KSH 320', status: 'Pending' },
  { id: 3, phone: '254 700 100 999', amount: 'KSH 840', status: 'Failed' },
];

function App() {
  const [phone, setPhone] = useState('254712345678');
  const [amount, setAmount] = useState('1500');
  const [status, setStatus] = useState('Ready');
  const [busy, setBusy] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);

  const summary = useMemo(() => ({
    total: transactions.filter((tx) => tx.status === 'Success').length,
    pending: transactions.filter((tx) => tx.status === 'Pending').length,
    volume: 'KSH 86k',
  }), [transactions]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedPhone = phone.replace(/\D/g, '');
    const amountNumber = Number(amount);

    if (!/^(?:2547\d{8}|07\d{8}|7\d{8})$/.test(normalizedPhone)) {
      setStatus('Enter a valid Kenyan phone number.');
      return;
    }

    if (!Number.isFinite(amountNumber) || amountNumber < 1) {
      setStatus('Enter an amount of at least KSH 1.');
      return;
    }

    setBusy(true);
    setStatus('Processing request...');

    try {
      const response = await fetch(`${API_BASE_URL}/api/stkpush`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalizedPhone, amount: amountNumber }),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.details || body.error || 'Payment request failed');
      }

      setStatus(body.ResponseDescription || 'STK prompt sent. Await customer confirmation.');
      setTransactions((prev) => [
        {
          id: Date.now(),
          phone: normalizedPhone,
          amount: `KSH ${amountNumber.toLocaleString()}`,
          status: 'Pending',
        },
        ...prev,
      ]);
    } catch (error) {
      setStatus(error.message || 'Unable to contact the payment server.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">M-Pesa POS</p>
          <h1>Quick Pay</h1>
        </div>
        <div className="status-pill">Online</div>
      </header>

      <section className="card hero-card">
        <form onSubmit={handleSubmit} className="pay-form">
          <label>
            Phone Number
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="254712345678" />
          </label>
          <label>
            Amount (KSH)
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" placeholder="1500" />
          </label>
          <button className="primary-btn" disabled={busy}>
            {busy ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
        <div className="status-box">
          <p className="eyebrow">Status</p>
          <h2>{status}</h2>
          <p>Fast, secure checkout designed for Android phones.</p>
        </div>
      </section>

      <section className="stats-grid">
        <article className="card stat-card">
          <p>Successful</p>
          <h3>{summary.total}</h3>
        </article>
        <article className="card stat-card">
          <p>Pending</p>
          <h3>{summary.pending}</h3>
        </article>
        <article className="card stat-card">
          <p>Volume</p>
          <h3>{summary.volume}</h3>
        </article>
      </section>

      <section className="card list-card">
        <div className="list-heading">
          <h3>Recent Activity</h3>
          <span>Live</span>
        </div>
        <ul>
          {transactions.map((tx) => (
            <li key={tx.id}>
              <div>
                <strong>{tx.phone}</strong>
                <p>{tx.amount}</p>
              </div>
              <span className={`badge ${tx.status.toLowerCase()}`}>{tx.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
