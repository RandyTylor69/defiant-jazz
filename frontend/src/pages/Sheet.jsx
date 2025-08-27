
import { useParams } from "react-router-dom";

export default function Sheet(){

    const {title, composer} = useParams()

    console.log(title, composer)

    return(
        <div className="w-full h-fit
        flex flex-col gap-12 ">
            <article className="w-full h-fit
            flex flex-col gap-6 text-black/70">
                <h1 className="text-2xl md:text-4xl">{title}</h1>
                <p>{composer}</p>
            </article>
        </div>
    )
}