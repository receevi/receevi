import TWLoader from "@/components/TWLoader";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-full">
            <TWLoader className="w-10 h-10 text-black"/>
        </div>
    )
}
