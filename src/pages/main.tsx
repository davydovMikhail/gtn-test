import { useState, useEffect, useRef } from 'react'
import Logo from "../img/Logo.svg"
import Preloader from "../img/Preloader.png"
import Flash from "../img/flash.svg"
import Wallet from "../img/wallet.svg"
import { useTypedSelector } from '../hooks/useTypedSelector';
import { useGetLastHash } from '../hooks/useGetLastHash';
import { useGetMaxWin } from '../hooks/useGetMaxWin';
import { useGetAllowance } from '../hooks/useGetAllowance';
import { useApproveToGame } from '../hooks/useApproveToGame';
import { useActions } from '../hooks/useActions';
import { useRequestGameHash } from '../hooks/useRequestGameHash';
import { useGetCurrentBlockNumber } from '../hooks/useGetBlockNumber'
import { usePlayBid } from '../hooks/usePlayBid';
import { useGetRandomNumber } from '../hooks/useGetRandomNumber';
import { useGetTotalGames } from '../hooks/useGetTotalGames';
import { useClaim } from '../hooks/useClaim';
import { useEthers } from "@usedapp/core";
import GameItem from '../components/game-item/gameItem';
import Pagination from '../components/pagination/pagination';
import { Status } from '../types/main'
import Connect from "../img/Connect.png"
import Fail from "../img/Fail.png"
import Guess from "../img/Guess.png"
import Won from "../img/Won.png"
import Flag from "../img/flag.svg"
import { useGetBalance } from '../hooks/useGetBalance';
import { toast } from "react-toastify";
import SetInterval from 'set-interval'
import Timeout from 'await-timeout';

import MiniLogo from "./../img/MiniLogo.svg"
import Telegram from "./../img/Telegram.svg"
import XxX from "./../img/twitter.png"

const Main = () => {
    
    function handleValidateAmount(_amount: string) {
        if (Number(_amount) < 1) {
            setAmount("1");
        } else if (Number(_amount) > balance) {
            setAmount(balance.toString());
        } else {
            setAmount(_amount);  
        }
    }
    function handleDoubleAmount() {
        const doubleAmount = Number(amount) * 2;
        if(doubleAmount > balance) {
            setAmount(balance.toString());
        } else {
            setAmount(doubleAmount.toString());
        }
    }
    function handleMaxAmount() {
        setAmount( (Math.floor(balance * 100000) / 100000).toString());
    }
    function handleHalfAmount() {
        const halfAmount = Number(amount) / 2;
        if(halfAmount < 1) {
            setAmount("1");
        } else {
            setAmount(halfAmount.toString());
        }
    }
    function handleMinAmount() {
        setAmount("1");
    }
    function handleDoublePercent() {
        const doublePercent = Number(percent) * 2;
        if(doublePercent > 95) {
            setPercent('95');
        } else {
            setPercent(Math.trunc(doublePercent).toString());
        }
    }
    function handleMaxPercent() {
        setPercent('95');
    }
    function handleMinPercent() {
        setPercent('5');
    }
    function handleHalfPercent() {
        const halfPercent = Number(percent) / 2;
        if(halfPercent < 5) {
            setPercent('5');
        } else {
            setPercent(Math.trunc(halfPercent).toString());
        }
    }
    function handleValidatePercent(_percent: string) {
        if(Number(_percent) > 95) {
            setPercent('95');
        } else if(Number(_percent) < 5) {
            setPercent('5');
        } else if(!_percent) {
            setPercent('50');
        } else {
            setPercent(Math.trunc(Number(_percent)).toString());
        }   
    }
    function getRange() {
        if(Number(percent) < 5 || Number(percent) > 95) {
          return NaN
        }
        return 10000 * Number(percent) -1;
    }
    function getPercent() {
        if(Number(percent) < 5 || Number(percent) > 95) {
            return 50;
        }
        return percent;
    }
    function getPossibleWin() {
        if(Number(percent) < 5 || Number(percent) > 95 || Number(amount) < 1) {
          return "NaN"
        }
        const answer = (Number(amount) * 98) / Number(percent);
        return answer.toFixed(2);
    }
    function getIcon() {
        if(status == Status.Connect) {
            return Connect;
        } else if (status == Status.Fail) {
            return Fail;
        } else if (status == Status.Guess) {
            return Guess
        } else if (status == Status.Loader) {
            return Preloader
        } else if (status == Status.Won) {
            return Won;
        }
    }

    async function handlePlay(isGreater: boolean) {
        if (!account) {
            toast.info('First connect your wallet', {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            return;
        }
        if (balance < Number(amount)) {
            toast.info('Not enough $RBET tokens', {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            return;
        }
        if (maxWin < (Number(getPossibleWin()) as number)) {
            toast.info('Possible payout exceed the max payout', {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            return;
        }
        firstIteration.current = true;
        SetStatus(Status.Loader);
        if((await allowanceHook(account) as number) < Number(amount)) {
            SetNotification('Approve your game tokens');
            await approveHook();
        }
        SetNotification('Requesting the hash of your game...');
        startLighthouse();
        const hashBefore = await hashHook(account);
        const balanceBefore = (await getBalanceHook(account as string)) as number;
        const targetBlock = (await requestHook(amount, percent, isGreater))?.blockNumber.toString() as string;
        SetNotification('Confirm the call to the play function');
        startLighthouse();
        SetInterval.start(async () => {
            const currentBlock = (await blockHook()) as number;
            const hashAfter = await hashHook(account);
            if(hashBefore !== hashAfter && currentBlock > Number(targetBlock) && firstIteration.current) {
                firstIteration.current = false;
                SetInterval.clear('checkHash')
                await playHook();
                const randomNumber = await randomHook(targetBlock, account);
                const balanceAfter = (await getBalanceHook(account as string)) as number;
                if(balanceAfter > balanceBefore) {
                    SetNotification(`Bet won. Random number is ${randomNumber}`);
                    SetStatus(Status.Won);
                } else {
                    SetNotification(`The bet is lost. Random number is ${randomNumber}`);
                    SetStatus(Status.Fail);
                }
                startLighthouse();
                setBalance(balanceAfter);
                const maxWin = await maxWinHook(); 
                setMaxWin(maxWin as number);
                const total = await totalHook();
                SetTotalGames(total);
                ClearGames();
            }
        }, 500, "checkHash")
    }

    async function handleClaim() {
        if (!account) {
            toast.info('First connect your wallet', {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            return;
        }
        if (balance > 0) {
            toast.info('You have already received test tokens', {
                position: "bottom-center",
                autoClose: 1000,
                hideProgressBar: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });
            return;
        }
        SetNotification("Getting tokens...");
        SetStatus(Status.Loader);
        await claimHook();
        const balanceAccount = await getBalanceHook(account as string);   
        setBalance(balanceAccount as number);
        SetNotification("Tokens received");
        SetStatus(Status.Won);
    }

    async function startLighthouse() {
        setBorderColor("#FFB81F");
        await Timeout.set(350);
        setBorderColor("rgba(255, 255, 255, 0.20)");
        await Timeout.set(350);
        setBorderColor("#FFB81F");
        await Timeout.set(350);
        setBorderColor("rgba(255, 255, 255, 0.20)");
        await Timeout.set(350);
        setBorderColor("#FFB81F");
        await Timeout.set(350);
        setBorderColor("rgba(255, 255, 255, 0.20)");
        await Timeout.set(350);
        setBorderColor("#FFB81F");
        await Timeout.set(350);
        setBorderColor("rgba(255, 255, 255, 0.20)");
        await Timeout.set(350);
        setBorderColor("#FFB81F");
        await Timeout.set(350);
        setBorderColor("rgba(255, 255, 255, 0.20)");
    }

    function colorLighthouse() {
        return borderColor;
    }

    const { SetNotification, ClearGames, SetStatus, SetTotalGames } = useActions();
    const getBalanceHook = useGetBalance();
    const maxWinHook = useGetMaxWin();
    const allowanceHook = useGetAllowance();
    const requestHook = useRequestGameHash();
    const hashHook = useGetLastHash();
    const blockHook = useGetCurrentBlockNumber();
    const playHook = usePlayBid();
    const randomHook = useGetRandomNumber();
    const totalHook = useGetTotalGames();
    const claimHook = useClaim();
    const { activateBrowserWallet, account } = useEthers();
    const [amount, setAmount] = useState('1');
    const [percent, setPercent] = useState('20');
    const [balance, setBalance] = useState(0);
    const [maxWin, setMaxWin] = useState(0); 
    const [borderColor, setBorderColor] = useState("rgba(255, 255, 255, 0.20)"); 
    const approveHook = useApproveToGame();
    const firstIteration = useRef(true);
    const {status, notification, games, totalGames} = useTypedSelector(state => state.main);

    useEffect(() => {
        const fetchData = async () => {
            const balanceAccount = await getBalanceHook(account as string);   
            setBalance(balanceAccount as number);
        }
        fetchData().catch(console.error);
    }, [account]);

    useEffect(() => {
        const fetchData = async () => {
            const total = await totalHook();
            SetTotalGames(total);
            const maxWin = await maxWinHook(); 
            setMaxWin(maxWin as number);
        }
        fetchData().catch(console.error);
    },[]);


    return (
        <>
            <main>
                <div className="header">
                    <div className="header__group">
                        <img className="header__logo" src={Logo} alt="logo"/>
                        {account ? 
                            <div className="header__balance">
                                <div className="header__wallet">
                                    <img src={Wallet}/>
                                </div>
                                <div className="header__baltext">
                                    Balance: {Number(balance).toFixed(2)}
                                </div>
                            </div> : ""
                        }
                        {account ?
                            <div className="header__tablo" style={{border: `1px solid ${colorLighthouse()}`}}> 
                                <div className="header__preloader">
                                    <img src={getIcon()} className={ status === Status.Loader ? "header__loader" : "" } />
                                </div>
                                <div className="header__info">
                                    {notification}
                                </div>
                            </div>
                            :
                            <div className="header__tablo">
                                <div className="header__preloader header__preloader_blink">
                                    <img src={Connect} className={ status === Status.Loader ? "header__loader" : "" } />
                                </div>
                                <div className="header__info">
                                    Connect your wallet
                                </div>
                            </div>
                        }
                    </div>
                    
                    <div className="header__buttons">
                        <a onClick={() => handleClaim()} className="button__size button__transparent" style={{marginRight: "8px", cursor: "pointer"}}>Claim Test</a>
                        
                        {account? <a onClick={() => activateBrowserWallet()} className="button__size button__transparent">{account?.slice(0, 5)}...{account?.slice(-2)}</a> :
                                  <a onClick={() => activateBrowserWallet()} className="button__size button__style">Connect Wallet</a>
                        }

                    </div>
                </div>
                <div className="max">
                    <div className="max__title">
                        <img className="max__icon" src={Flash} alt="logo"/>
                        <div>Maximum possible payout:</div>
                    </div>
                    <div className="max__sum">
                        {maxWin.toFixed(2)} $RBET
                    </div>
                </div>
                <div className="wrapper">
                    <div className="inputs">
                        <div className="inputs__section">
                            <div className="inputs__title">
                                Bid amount ($RBET)
                            </div>
                            <input 
                                type="number"
                                placeholder="Enter amount"
                                className="inputs__input"
                                value={amount || ''}
                                onChange={(e) => setAmount(e.target.value)}
                                onBlur={(e) => handleValidateAmount(e.target.value)}
                            />
                            <div className="inputs__buttons">
                                <button onClick={() => handleDoubleAmount()} className="inputs__setter">Double</button>
                                <button onClick={() => handleHalfAmount()} className="inputs__setter">Half</button>
                                <button onClick={() => handleMaxAmount() } className="inputs__setter">Max</button>
                                <button onClick={() => handleMinAmount()} className="inputs__setter">Min</button>
                            </div>
                        </div>
                        <div className="inputs__section">
                            <div className="inputs__title">
                                Chance of win (%)
                            </div>
                            <input 
                                type="number"
                                placeholder="Enter percent"
                                className="inputs__input"
                                value={percent || ''}
                                onChange={(e) => setPercent(e.target.value)}  
                                onBlur={(e) => handleValidatePercent(e.target.value)}  
                            />
                            <div className="inputs__buttons">
                                <button onClick={() => handleDoublePercent()} className="inputs__setter">Double</button>
                                <button onClick={() => handleHalfPercent()} className="inputs__setter">Half</button>
                                <button onClick={() => handleMaxPercent()} className="inputs__setter">Max</button>
                                <button onClick={() => handleMinPercent()} className="inputs__setter">Min</button>
                            </div>
                        </div>
                    </div>
                    <div className="decision">
                        <button disabled={ status == Status.Loader } onClick={() => handlePlay(false)} className="decision__button decision__button_less">
                            Less
                        </button>
                        <button disabled={ status == Status.Loader } onClick={() => handlePlay(true)} className="decision__button decision__button_more">
                            More
                        </button>
                    </div>
                    <div className="pieces">
                        <div className="pieces__cell pieces__leftborder">0 - { getRange() }</div>
                        <div className="pieces__cell pieces__rightborder">{ 999999 - getRange() } - 999999</div>
                    </div>
                    <div className="ranges">
                        <div
                            style={{width: getPercent() + "%"}}
                            className="ranges__line ranges__line_right"
                        ></div>
                        <div
                            style={{width: getPercent() + "%"}}
                            className="ranges__line ranges__line_left"
                        ></div>
                    </div>
                    <div className="possible">
                        Possible Payout
                    </div>
                    <div className="possibletext">
                        {getPossibleWin()} $RBET
                    </div>
                    <div className="total">
                        <div className="total__title">
                            <img className="total__icon" src={Flag} alt="flag"/>
                            <div>Total Games Results</div>
                        </div>
                        <div className="total__sum">
                            {totalGames} Games
                        </div>
                    </div>
                </div>
                <div className="boardwrap">
                    <div className="board">
                        <div className="board__header">
                            <div className="board__title">
                                Status
                            </div>
                            <div className="board__title">
                                Address
                            </div>
                            <div className="board__title">
                                Chance (%)
                            </div>
                            <div className="board__title">
                                Payout ($RBET)
                            </div>
                            <div className="board__title">
                                Random Number
                            </div>
                        </div>
                        {games.map(block => GameItem(block))}
                    </div> 
                    <Pagination/>
                </div>
                <div className="footer">
                    <img src={MiniLogo} alt="mini logo" />
                    <div className="footer__text">Privacy Policy</div>
                    <div className="footer__text">Copyright 2023. RabgeBet. All Rights Reserved.</div>
                    <div className="footer__links">
                        <a href="#">
                            <img src={Telegram} alt="telegram"/>
                        </a>
                        <a href="#">
                            <img src={XxX} alt="X"/>
                        </a>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Main;