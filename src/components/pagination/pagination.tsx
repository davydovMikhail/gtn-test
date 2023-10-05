import { useRef, useEffect } from "react";
import Shevron from "../../img/iconRight.svg"
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useActions } from '../../hooks/useActions';
import { useGetSliceHashes } from '../../hooks/useGetSliceHashes';
import { useGetGame } from '../../hooks/useGetGame';

const Pagination = () => {
    const { totalGames, currentPage } = useTypedSelector(state => state.main);
    const { PushGame, ClearGames, SetCurrentPage } = useActions();

    const sliceHook = useGetSliceHashes();
    const gameHook = useGetGame();
    const breakFor = useRef(false);
    const disableButs = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            if(totalGames > 0) {
                changePage(1);
            }
        }
        fetchData().catch(console.error);
    }, [totalGames]);

    async function changePage(page: number) {
        disableButs.current = true;
        breakFor.current = true;
        
        SetCurrentPage(page);

        ClearGames();

        let start;
        let end;
        
        if (page === lastPage() && page != 1 && page != 2) {          
            end = remnant() || 10;
            start = 0;
        } else {
            end = totalGames;
            end = end - 10 * (page - 1);
            start = end - 10;
            if (start < 0) {
                start = 0;
            }
        }
        
        const hashes = await sliceHook(start, end) as any[];
        
        breakFor.current = false;
        disableButs.current = false;
        for(let i = 0; i < hashes.length; i++) {
            if (breakFor.current) {
                breakFor.current = false;
                break;
            }
            const game = await gameHook(hashes[i]);
            if (breakFor.current) {
                breakFor.current = false;
                break;
            }
            PushGame(game);
            if (breakFor.current) {
                breakFor.current = false;
                break;
            }
        }
    }

    function lastPage() {
        let last = Math.trunc( totalGames / 10 );

        if (remnant() > 0) {
            return last + 1;
        } else {
            return last;
        }
        
    }

    function remnant() {
        return totalGames % 10;
    }

    function centralDigit() {
        if(currentPage == 1) {
            return 2;
        } else if (currentPage == lastPage()) {
            return lastPage() - 1;
        } else {
            return currentPage;
        }
    }
    
        return (
            <>
            { totalGames > 10 ? 
                <div className="pagination">
                    <button
                        onClick={() => {changePage(currentPage - 1)}} 
                        disabled={currentPage == 1 || disableButs.current} 
                        style={{borderTopLeftRadius: "16px", borderBottomLeftRadius: "16px"}}
                        className={"pagination__cell " + (currentPage == 1 ? "" : "pagination__cell_hover") }
                    >
                        <img style={{transform: "rotate(180deg)"}} src={Shevron} alt="shev right" />
                    </button>
                    <button
                        className={"pagination__cell " + (currentPage == 1 ? "pagination__cell_active" : "pagination__cell_hover") }
                        disabled={currentPage == 1 || disableButs.current} 
                        onClick={() => {changePage(1)}} 
                    >
                        <div 
                            className={"pagination__text " + (currentPage == 1 ? "pagination__text_active" : "") }    
                        >
                            1
                        </div>
                    </button>
                    {
                        currentPage == 1 || currentPage == 2 ? 
                        "" 
                        :
                        <div className="pagination__cell">
                            <div className="pagination__text">
                                ...
                            </div>
                        </div>
                    }
                    { lastPage() == 2 ? 
                        ""    
                        :
                        <button 
                                className={"pagination__cell " + (currentPage == centralDigit() ? "pagination__cell_active" : "pagination__cell_hover") }
                                disabled={currentPage == centralDigit() || disableButs.current} 
                                onClick={() => {changePage(centralDigit())}} 
                        >
                            <div
                                className={"pagination__text " + (currentPage == centralDigit() ? "pagination__text_active" : "") } 
                            >
                                {centralDigit()}
                            </div>
                        </button>
                    }

                    
                    {
                        currentPage == lastPage() || currentPage == lastPage() - 1? 
                        "" 
                        :
                        <div className="pagination__cell">
                            <div className="pagination__text">
                                ...
                            </div>
                        </div>
                    }
                    <button 
                        className={"pagination__cell " + (currentPage == lastPage() ? "pagination__cell_active" : "pagination__cell_hover") }
                        onClick={() => changePage(lastPage())}
                        disabled={currentPage == lastPage() || disableButs.current} 
                    >
                        <div 
                            className={"pagination__text " + (currentPage == lastPage() ? "pagination__text_active" : "") }
                        >
                            {lastPage()}
                        </div>
                    </button>
                    <button 
                        disabled={currentPage == lastPage() || disableButs.current} 
                        onClick={() => {changePage(currentPage + 1)}} 
                        style={{borderTopRightRadius: "16px", borderBottomRightRadius: "16px"}} 
                        className={"pagination__cell " + (currentPage == lastPage() ? "" : "pagination__cell_hover") } 
                    >
                        <img src={Shevron} alt="shev right" />
                    </button>
                </div>
            : ""}
            </>
               
        )   
}
export default Pagination;