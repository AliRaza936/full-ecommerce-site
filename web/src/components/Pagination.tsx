interface Props{
page:number
total:number
setPage:(n:number)=>void
}

export default function Pagination({page,total,setPage}:Props){

return(

<div className="flex gap-2 justify-center mt-8">

{Array.from({length:total}).map((_,i)=>{

const p=i+1

return(
<button
key={p}
onClick={()=>setPage(p)}
className={`px-3 py-1 border rounded ${p===page?"bg-blue-500 text-white":""}`}
>
{p}
</button>
)

})}

</div>

)
}