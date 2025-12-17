export const Loader = ({className = 'size-10'}) => {
    return (<>
        <div className="flex flex-col justify-center items-center h-screen gap-3">
            <div className={`animate-spin rounded-full border-t-4 border-b-4 border-teal-500 ${className}`}></div>
            <p>Loading...</p>
        </div>
    </>)
}