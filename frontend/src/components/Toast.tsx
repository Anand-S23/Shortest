interface ToastProps {
    message: string;
    isError: boolean;
}

export const Toast = (props: ToastProps) => {
    return (
        <div className="py-4 flex justify-center">
            <p className={{props.isError ? 'bg-red-700' : 'bg-green-600'} + " text-white text-center text-lg min-w-[200px] max-w-[24rem] md:max-w-[48rem] lg:max-w-[56rem]"}>
                {props.message}
            </p>
        </div>
    );
}
