interface Props{
filters:string[]
remove:(value:string)=>void
}

export default function SelectedFilters({filters,remove}:Props){

if(filters.length===0) return null

return(

<div className="flex flex-wrap gap-2 mb-4">

{filters.map(f=>(
<button
key={f}
className="border px-3 py-1 rounded-full text-sm"
onClick={()=>remove(f)}
>
{f} ✕
</button>
))}

</div>

)
}