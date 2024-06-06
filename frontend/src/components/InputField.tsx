import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';

import { apiEndpoint } from '../config';
import { URLData } from './URLInfo';
import { MessageData } from './Toast';

interface InputFieldProps {
    setGeneratedData: (data: URLData) => void;
    setMessageData: (data: MessageData) => void;
}

const inputValidator = z.string()
    .trim()
    .url({ message: "Must provide a valid URL" })
    .startsWith("https://", { message: "Must provide a valid URL" });

export const InputField = ({setGeneratedData, setMessageData}: InputFieldProps) => {
    const [value, setValue] = useState<string>('');

    const generateURL = async (inputURL: string) => {
        try {
            let validatedURL = inputValidator.parse(inputURL);

            setMessageData({text: '', isError: false});

            axios.post(apiEndpoint, { url: validatedURL })
                .then((response) => setGeneratedData({
                    shortURL: window.location.href + response.data.short_hash,
                    visitCount: response.data.visit_count
                }))
                .catch((error) => setMessageData({
                    text: error.request.responseText,
                    isError: true
                }));

        } catch (err) {
            setMessageData({text: 'Please provide a valid URL', isError: true});
        }
    }

    return (
        <div className="pt-8 pb-4 flex justify-center">
            <div className="relative flex h-10 w-full min-w-[200px] max-w-[24rem] md:max-w-[48rem] lg:max-w-[56rem] text-lg">
                <input
                    type="text"
                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-amber-400 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    onChange={(e) => setValue(e.target.value)}
                    placeholder=" "
                    required
                />
                <button
                    type="button"
                    className="!absolute right-1 top-1 z-10 select-none rounded bg-amber-400 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-black shadow-md shadow-amber-400/20 transition-all hover:shadow-lg hover:shadow-amber-400/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
                    data-ripple-light="true"
                    onClick={() => generateURL(value)}
                >
                    Generate
                </button>
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-amber-400 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-amber-400 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-amber-400 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Long URL
                </label>
            </div>
        </div>
    );
}

