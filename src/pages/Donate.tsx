import { useState, useEffect } from 'react';
import { Bitcoin, Copy, Check, Heart, ChevronDown, ChevronUp, AlertTriangle, Wallet, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface CryptoNetwork {
  name: string;
  symbol: string;
  address: string;
  network: string;
  qrCodePath?: string; // Path to QR code image in public folder
  majorTokens: string[]; // List of major supported tokens
  icon: string; // Icon identifier for cryptocurrency-icons package
  color: string;
  description: string;
  destinationTag?: string; // For XRP and other networks that require tags/memos
}

export default function Donate() {
  const { user, userProfile } = useAuth();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [expandedCrypto, setExpandedCrypto] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill donor name when dialog opens
  useEffect(() => {
    if (showConfirmDialog && userProfile) {
      setDonorName(userProfile.nickname || userProfile.email?.split('@')[0] || '');
    }
  }, [showConfirmDialog, userProfile]);

  // Updated crypto network configurations with major token support
  const cryptoNetworks: CryptoNetwork[] = [
    {
      name: 'SUI',
      symbol: 'SUI',
      address: '0x2db1e540059d3b7b7e3fa053fbd18942a24a3c337c71b3361d790d38c78214d4',
      network: 'SUI Network',
      qrCodePath: '/qr-codes/sui-qr.png',
      majorTokens: ['SUI', 'USDC', 'USDT', 'wETH', 'wBTC', 'CETUS', 'DEEP', 'SCA'],
      icon: 'sui',
      color: 'from-blue-500 to-cyan-500',
      description: 'Send SUI or any major SUI ecosystem token'
    },
    {
      name: 'Solana',
      symbol: 'SOL',
      address: '5yR9pYwjvnDtXzo9FsvTbgM2zY7Liqgacr6wvvpkiBeR',
      network: 'Solana Network',
      qrCodePath: '/qr-codes/solana-qr.png',
      majorTokens: ['SOL', 'USDC', 'USDT', 'RAY', 'JUP', 'BONK', 'JTO', 'WEN'],
      icon: 'sol',
      color: 'from-purple-500 to-indigo-500',
      description: 'Supports SOL and major SPL tokens'
    },
    {
      name: 'NEAR Protocol',
      symbol: 'NEAR',
      address: '075e3a9b9e32fd0a65bc8ead28617d3eb7788ce7fa8ce21a8fe0ea70be0735c4',
      network: 'NEAR Protocol',
      qrCodePath: '/qr-codes/near-qr.png',
      majorTokens: ['NEAR', 'SWEAT', 'USDT', 'ASI', 'LINEAR', 'ASI', 'REF'],
      icon: 'near',
      color: 'from-emerald-500 to-teal-500',
      description: 'NEAR and ecosystem tokens supported'
    },
    {
      name: 'Avalanche C',
      symbol: 'AVAX',
      address: '0xc81936b64c19f9e5002ca6f92d49338f43f0a4d6',
      network: 'Avalanche C-Chain',
      qrCodePath: '/qr-codes/avax-qr.png',
      majorTokens: ['AVAX', 'USDC.e', 'USDT.e', 'wETH', 'wBTC.e', 'JOE', 'AVXT', 'LINK.e'],
      icon: 'avax',
      color: 'from-red-500 to-pink-500',
      description: 'Avalanche C-Chain tokens accepted'
    },
    {
      name: 'Polygon',
      symbol: 'MATIC',
      address: '0xc81936b64c19f9e5002ca6f92d49338f43f0a4d6',
      network: 'Polygon Network',
      qrCodePath: '/qr-codes/matic-qr.png',
      majorTokens: ['POL', 'USDC', 'USDT', 'wETH', 'wBTC', 'AAVE', 'LINK'],
      icon: 'matic',
      color: 'from-purple-600 to-violet-600',
      description: 'Polygon network tokens supported'
    },
    {
      name: 'Cosmos',
      symbol: 'ATOM',
      address: 'cosmos1lmcmehn2ce3tqpcx8kkyzz0w0qscckqcqyhl5m',
      network: 'Cosmos Hub',
      qrCodePath: '/qr-codes/atom-qr.png',
      majorTokens: ['ATOM', 'OSMO', 'JUNO', 'CRO', 'SCRT', 'AKT'],
      icon: 'atom',
      color: 'from-indigo-500 to-blue-600',
      description: 'Cosmos ecosystem tokens accepted'
    },
    {
      name: 'XRP',
      symbol: 'XRP',
      address: 'rBuZfn1m4tA6znziHsRp9AyC1M3qg6rgbF',
      network: 'Ripple',
      qrCodePath: '/qr-codes/xrp-qr.png',
      majorTokens: ['XRP'],
      icon: 'xrp',
      color: 'from-gray-600 to-gray-800',
      description: 'XRP on XRP Ledger',
      destinationTag: '6451546'
    },
    {
      name: 'Cardano',
      symbol: 'ADA',
      address: 'addr1q9tcyrz3s60v80gqgtp32wafyvn4n8s0p0ytpan4drm97euq59s9e9dfaq6zc4vwez9lgsavsa9ltcr5mm46tjdgcmssmuguhk',
      network: 'Cardano Network',
      qrCodePath: '/qr-codes/ada-qr.png',
      majorTokens: ['ADA'],
      icon: 'ada',
      color: 'from-blue-600 to-cyan-600',
      description: 'Cardano native token supported i.e. ADA'
    },
    {
      name: 'Bitcoin',
      symbol: 'BTC',
      address: 'bc1q0uj9g7ntkpz58patxq4g32pnj5g4ccwjvyll7zuzeynyd8f6n2gqarmv26',
      network: 'Bitcoin Network',
      qrCodePath: '/qr-codes/btc-qr.png',
      majorTokens: ['BTC'],
      icon: 'btc',
      color: 'from-orange-500 to-yellow-500',
      description: 'Bitcoin - The original cryptocurrency'
    }
  ];

  const binancePayId = '861888131'; // Your Binance Pay ID
  const evmWalletAddress = '0xa33a559e5134b2a7ab9cdd24cc63642614859645'; // Your EVM wallet address

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(label);
      toast.success(`${label} copied!`, {
        description: 'Address copied to clipboard'
      });
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      toast.error('Failed to copy', {
        description: 'Please copy manually'
      });
    }
  };

  const handleConfirmDonation = async () => {
    setIsSubmitting(true);
    
    try {
      // Save donation confirmation to Firestore
      await addDoc(collection(db, 'donationConfirmations'), {
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous',
        donorName: donorName || 'Anonymous',
        message: donorMessage || '',
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
      
      toast.success('Thank you! 💙', {
        description: 'Your confirmation has been recorded. We appreciate your support!'
      });
      
      setShowConfirmDialog(false);
      setDonorName('');
      setDonorMessage('');
    } catch (error) {
      console.error('Error saving donation confirmation:', error);
      toast.error('Failed to save confirmation', {
        description: 'Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExpand = (crypto: string) => {
    setExpandedCrypto(expandedCrypto === crypto ? null : crypto);
  };

  // Helper function to get crypto icon with proper fallbacks
  const getCryptoIconUrl = (icon: string): string => {
    // Special cases for newer cryptos - using CoinGecko assets (most reliable)
    const specialIcons: Record<string, string> = {
      'sui': 'https://assets.coingecko.com/coins/images/26375/standard/sui-ocean-square.png',
      'near': 'https://assets.coingecko.com/coins/images/10365/standard/near.jpg',
    };
    
    // Check if we have a special icon URL
    if (specialIcons[icon]) {
      return specialIcons[icon];
    }
    
    // Default: cryptocurrency-icons (most reliable for established cryptos)
    return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${icon}.svg`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full backdrop-blur-sm border-2 border-border/50 mb-6 shadow-lg animate-pulse hover:shadow-2xl transition-shadow relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-red-500 opacity-15 dark:opacity-25"></div>
            <Heart className="h-10 w-10 text-red-500 fill-red-500 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground dark:bg-gradient-to-r dark:from-primary dark:to-accent dark:bg-clip-text dark:text-transparent">
            Support Airdrop Tracker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-3">
            Help keep this platform free and ad-free for everyone. Your crypto donations 
            directly support server costs, development, and new features.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>Every contribution makes a difference!</span>
          </div>
        </div>

        {/* Security Warning */}
        <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Security Reminder</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Always double-check the network and address before sending. Transactions on the blockchain are irreversible. 
              Make sure you select the correct network matching the address provided.
            </p>
          </div>
        </div>

        {/* Binance Pay Section - PRIORITY */}
        <div className="bg-card border-2 border-yellow-500/30 rounded-xl p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-bl-full"></div>
          <Badge className="mb-4 bg-yellow-500 text-black hover:bg-yellow-600">⚡ RECOMMENDED</Badge>
          
          <div className="flex items-start gap-3 mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 relative backdrop-blur-sm border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 opacity-10 dark:opacity-20"></div>
              <img 
                src="https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/bnb.svg"
                alt="Binance logo"
                className="w-7 h-7 object-contain relative z-10"
                onError={(e) => {
                  // Fallback to alternative Binance logo source
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://cryptologos.cc/logos/bnb-bnb-logo.svg";
                }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Binance Pay Donation</h2>
              <p className="text-sm text-muted-foreground">Instant, secure & supports all major cryptocurrencies</p>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            Quickly donate via Binance Pay by scanning the QR code or entering the Pay ID.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pay ID */}
            <div className="bg-muted/50 rounded-lg p-4">
              <Label className="text-sm text-muted-foreground mb-2 block">Binance Pay ID</Label>
              <div className="flex items-center gap-2 mb-3">
                <code className="flex-1 text-2xl font-bold font-mono bg-background px-3 py-2 rounded border">
                  {binancePayId}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(binancePayId, 'Binance Pay ID')}
                  className="flex-shrink-0"
                >
                  {copiedAddress === 'Binance Pay ID' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Open Binance app → Pay → Transfer → Enter Pay ID
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
              <Label className="text-sm text-muted-foreground mb-3">Scan with Binance App</Label>
              <div className="bg-white p-2 rounded-lg border-2 border-border w-48 h-48 flex items-center justify-center">
                <img 
                  src="/qr-codes/binance-pay-qr.png" 
                  alt="Binance Pay QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 text-center px-2">QR Code<br/>Missing</div>';
                  }}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Scan to send donation instantly
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Instructions:</strong> Scan with Binance App or enter Pay ID to send your donation instantly and securely. 
              Supports BTC, ETH, USDT, BNB, and 100+ other cryptocurrencies.
            </p>
          </div>
        </div>

        {/* Universal EVM Wallet Section */}
        <div className="bg-card border-2 border-blue-500/30 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 relative backdrop-blur-sm border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 dark:opacity-20"></div>
              <img 
                src="https://rabby.io/assets/images/logo-128.png"
                alt="Rabby Wallet logo"
                className="w-7 h-7 object-contain relative z-10"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Donate with EVM-Compatible Wallet</h2>
              <p className="text-sm text-muted-foreground">Supports Ethereum & all major EVM chains</p>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">
            One address for all EVM-compatible networks: Ethereum, BNB Chain, Polygon, Avalanche, Arbitrum, Optimism, and more.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Wallet Address */}
            <div className="bg-muted/50 rounded-lg p-4">
              <Label className="text-sm text-muted-foreground mb-2 block">EVM Wallet Address</Label>
              <div className="flex items-center gap-2 mb-3">
                <code className="flex-1 text-xs font-mono bg-background px-3 py-2 rounded border break-all">
                  {evmWalletAddress}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(evmWalletAddress, 'EVM Address')}
                  className="flex-shrink-0"
                >
                  {copiedAddress === 'EVM Address' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                ⚡ Works with all EVM chains
              </p>
            </div>

            {/* QR Code */}
            <div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center justify-center">
              <Label className="text-sm text-muted-foreground mb-3">Scan with Wallet App</Label>
              <div className="bg-white p-2 rounded-lg border-2 border-border w-48 h-48 flex items-center justify-center">
                <img 
                  src="/qr-codes/evm-qr.png" 
                  alt="EVM Wallet QR Code"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 text-center px-2">QR Code<br/>Missing</div>';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-sm text-green-900 dark:text-green-100">
              <strong>Supported Networks:</strong> Send ETH, USDT (ERC-20/BEP-20), USDC, BNB, MATIC, AVAX, LINK and other EVM tokens. 
              <span className="font-semibold"> Please verify the network before sending</span> - this wallet does NOT support TRC-20 (Tron).
            </p>
          </div>
        </div>

        {/* Other Crypto Networks */}
        <div className="bg-card border rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 relative backdrop-blur-sm border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-10 dark:opacity-20"></div>
              <Layers className="h-6 w-6 relative z-10 text-primary dark:text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Other Blockchain Networks</h2>
              <p className="text-sm text-muted-foreground">Network-specific addresses for dedicated donations</p>
            </div>
          </div>
          <p className="text-muted-foreground mb-6">
            Select your preferred network below. Each dropdown shows all major tokens supported on that network.
          </p>
          
          <div className="space-y-3">
            {cryptoNetworks.map((network) => (
              <div
                key={network.symbol}
                className="border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
              >
                {/* Header - Always Visible */}
                <button
                  className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors"
                  onClick={() => toggleExpand(network.symbol)}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 relative bg-gradient-to-br from-transparent to-transparent backdrop-blur-sm border-2 border-border/50 shadow-lg hover:shadow-xl transition-shadow">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${network.color} opacity-10 dark:opacity-20`}></div>
                      <img 
                        src={getCryptoIconUrl(network.icon)}
                        alt={`${network.name} logo`}
                        className="w-7 h-7 object-contain relative z-10"
                        onError={(e) => {
                          // Show crypto symbol as fallback
                          e.currentTarget.onerror = null;
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent && !parent.querySelector('.fallback-text')) {
                            const fallback = document.createElement('span');
                            fallback.className = 'fallback-text font-bold text-sm';
                            fallback.textContent = network.symbol;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-bold text-lg">{network.name} & Major Tokens</p>
                      <p className="text-sm text-muted-foreground">{network.description}</p>
                    </div>
                  </div>
                  
                  {expandedCrypto === network.symbol ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-2" />
                  )}
                </button>

                {/* Expandable Content */}
                {expandedCrypto === network.symbol && (
                  <div className="px-4 pb-4 border-t bg-muted/20">
                    <div className="pt-4 space-y-4">
                      {/* XRP Destination Tag Warning */}
                      {network.destinationTag && (
                        <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-lg p-3 flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                              ⚠️ IMPORTANT: Destination Tag Required!
                            </p>
                            <p className="text-xs text-orange-800 dark:text-orange-200">
                              You MUST copy both the address AND the destination tag below. Sending XRP without the correct tag may result in lost funds.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Bitcoin-specific Warning */}
                      {network.symbol === 'BTC' && (
                        <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-3 flex items-start gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                              ⚠️ BTC Only - Read Carefully!
                            </p>
                            <p className="text-xs text-red-800 dark:text-red-200">
                              Only use this address to deposit BTC. Please don't deposit inscriptions, NFTs, or any other non-BTC assets, as they can't be credited or returned.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Supported Tokens */}
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">Major Supported Tokens:</Label>
                        <div className="flex flex-wrap gap-2">
                          {network.majorTokens.map((token) => (
                            <Badge key={token} variant="secondary" className="text-xs">
                              {token}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Scan with your wallet app or copy the address to donate any of these tokens.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* QR Code Section */}
                        <div className="flex justify-center">
                          <div className="bg-white p-2 rounded-lg border-2 border-border w-48 h-48 flex items-center justify-center">
                            <img 
                              src={network.qrCodePath || `/qr-codes/${network.symbol.toLowerCase()}-qr.png`}
                              alt={`${network.name} QR Code`}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100 rounded text-xs text-gray-500 text-center px-2">QR Code<br/>Missing</div>';
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Wallet Address Section */}
                        <div className="bg-background rounded-lg p-4 space-y-4">
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              {network.network} Address
                            </Label>
                            <code className="text-xs font-mono break-all block mb-3 bg-muted p-2 rounded">
                              {network.address}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => copyToClipboard(network.address, network.name)}
                            >
                              {copiedAddress === network.name ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy Address
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Destination Tag Field (for XRP, etc.) */}
                          {network.destinationTag && (
                            <div className="border-t pt-4">
                              <Label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                                Destination Tag (REQUIRED)
                              </Label>
                              <code className="text-sm font-mono font-bold block mb-3 bg-orange-500/10 p-3 rounded border-2 border-orange-500/30">
                                {network.destinationTag}
                              </code>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full border-orange-500/30 hover:bg-orange-500/10"
                                onClick={() => copyToClipboard(network.destinationTag!, `${network.name} Tag`)}
                              >
                                {copiedAddress === `${network.name} Tag` ? (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Tag Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Destination Tag
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Made a Donation Section */}
        <div className="bg-card border rounded-xl p-8 text-center mt-8">
          <h3 className="text-xl font-semibold mb-2">Made a Donation?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Let us know so we can thank you personally! (Optional)
          </p>
          <Button 
            size="lg"
            onClick={() => setShowConfirmDialog(true)}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Confirm Your Donation
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            🙏 Thank you for your generous support! Your donation helps us keep improving Airdrop Tracker.
          </p>
        </div>
      </div>

      {/* Donation Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              Thank You for Donating!
            </DialogTitle>
            <DialogDescription>
              Your support means the world to us. Optionally leave your name or a message below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="donor-name">Your Name (Optional)</Label>
              <Input
                id="donor-name"
                placeholder="e.g., John Crypto"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="donor-message">Message (Optional)</Label>
              <Textarea
                id="donor-message"
                placeholder="Leave a message or tell us what you'd like to see improved..."
                value={donorMessage}
                onChange={(e) => setDonorMessage(e.target.value)}
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              💡 This is completely optional and only for our records. We'll use it to improve the platform and thank our supporters.
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSubmitting}
            >
              Skip
            </Button>
            <Button
              onClick={handleConfirmDonation}
              disabled={isSubmitting}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Confirmation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
