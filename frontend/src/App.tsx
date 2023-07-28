import { useState, useEffect } from 'react';
import { ReactComponent as Logo } from './link.svg';
import { MessageData, Toast } from './components/Toast';
import { URLData, URLInfo } from './components/URLInfo';
import { InputField } from './components/InputField';
import { apiEndpoint } from './config';

export default function App() {
    const [messageData, setMessageData] = useState<MessageData>({
        text: '', isError: false
    });

    const [generatedData, setGeneratedData] = useState<URLData>({
        shortURL: '', visitCount: 0
    });

    const [err404, setErr404] = useState(false);

    useEffect(() => {
        let pathname = window.location.pathname;

        if (pathname !== '/') {
            if (pathname === '/404') {
                setErr404(true);
                setMessageData({
                    text: '404 website not found in database, redirecting in 5 seconds...', 
                    isError: true
                });

                setTimeout(() => {
                    window.location.replace(window.location.origin);
                }, 5000);

                return;
            }

            window.location.replace(apiEndpoint + pathname);
        }
    }, [])

    return (
        <div className="max-w-[2000px] mx-auto h-screen text-neutral-900 bg-white">
            <nav className="mx-auto p-4 bg-amber-400 flex justify-center">
                <Logo className="w-8 h-8"/>
                <h1 className="text-3xl font-ubuntu font-bold text-black px-1">
                    Shortest
                </h1>
            </nav>

            <h3 className="pt-8 text-xl text-center">Enter a link to shorten, and get stats if URL already exists!</h3>

            <div className="mx-8 md:mx-32 lg:mx-52">
                { !err404 && 
                    <InputField 
                        setGeneratedData={setGeneratedData}
                        setMessageData={setMessageData} /> 
                }

                { generatedData.shortURL !== '' && 
                    <URLInfo 
                        data={generatedData}
                        setMessage={setMessageData} />
                }

                { messageData.text !== '' && <Toast data={messageData} /> }
            </div>
        </div>
    );
}

