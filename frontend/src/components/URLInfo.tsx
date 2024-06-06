import { MessageData } from './Toast';

export interface URLData {
    shortURL: string;
    visitCount: number;
}

interface URLInfoProps {
    data: URLData;
    setMessage: (message: MessageData) => void;
}

export const URLInfo = ({data, setMessage}: URLInfoProps) => {
    const copyText = () => {
        navigator.clipboard.writeText(data.shortURL);
        setMessage({text: "Text copied!", isError: false});
    }

    return (
        <>
            <div className="pb-4 flex justify-center">
                    <div className="relative flex h-10 w-full min-w-[200px] max-w-[24rem] md:max-w-[48rem] lg:max-w-[56rem] text-lg">
                        <p className="peer h-full w-full rounded-[7px] border border-black-200 px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all">
                            {data.shortURL.toString()}
                        </p>
                        <button
                            type="button"
                            className="!absolute right-1 top-1 z-10 select-none rounded bg-amber-400 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-amber-400/20 transition-all hover:shadow-lg hover:shadow-amber-400/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
                            data-ripple-light="true"
                            onClick={() => copyText()}
                        >
                            Copy
                        </button>
                    </div>
            </div>

            <p className="h-10 w-full min-w-[200px] text-center pt-3"> 
                <span className="font-bold">Visit Count: </span>
                {data.visitCount.toString()}
            </p>
        </>
    );
}

