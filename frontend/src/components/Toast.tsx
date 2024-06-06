export interface MessageData {
    text: string;
    isError: boolean;
}

interface ToastProps {
    data: MessageData
}

export const Toast = ({ data }: ToastProps) => {
    return (
        <div className="py-4 flex justify-center">
            <p className={(data.isError ? 'bg-red-700' : 'bg-green-600') + " text-white text-center text-lg min-w-[200px] max-w-[24rem] md:max-w-[48rem] lg:max-w-[56rem]"}>
                {data.text}
            </p>
        </div>
    );
}
    
