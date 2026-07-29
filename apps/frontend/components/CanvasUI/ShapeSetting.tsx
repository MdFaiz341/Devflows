
import { motion, AnimatePresence} from "framer-motion"
import { Minus } from "lucide-react"



const stroke = [{
    id : 1,
    color : "#1e1e1e"
}, {
    id : 2,
    color : "#e03131"
}, {
    id : 3,
    color : "#2f9e44"
}, {
    id : 4, 
    color : "#1971c2"
}]

const background = [{
    id : 1,
    color : "transparent"
}, {
    id : 2,
    color : "#ffc9c9"
}, {
    id : 3,
    color : "#b2f2bb"
}, {
    id : 4, 
    color : "#ffec99"
}]

const strokeWidth = [{
    id : 1,
    strokeWidth : 1,
}, {
    id : 2,
    strokeWidth : 3,
}, {
    id : 3,
    strokeWidth : 5,
}]


export const ShapeSetting = ({active}:{
    active : boolean,
})=>{


    return(
        <AnimatePresence>
        {true && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#0F172A] border border-white/10 rounded-3xl p-7 shadow-2xl"
            >
              <div className="flex flex-col text-white gap-4">
                <div className="flex flex-col gap-1">
                    <p>Stroke</p>
                    <div className="flex gap-2">
                        {
                            stroke.map((clr)=>{
                                return(
                                    <div key={clr.id}  className={`w-7 h-7 border rounded-lg bg-[${clr.color}]`}></div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <p>Background</p>
                    <div className="flex gap-2">
                        {
                            background.map((clr)=>(
                                <div key={clr.id} className={`w-7 h-7 border rounded-lg bg-[${clr.color}]`}></div>
                            ))
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="">Stroke width</p>
                    <div className="flex gap-2">
                        {
                            strokeWidth.map((val)=>(
                                <div key={val.id} className="w-7 h-7 border rounded-lg bg-gray-700 flex justify-center items-center">
                                    <Minus strokeWidth={val.strokeWidth}/>
                                </div>
                                
                            ))
                        }
                    </div>
                </div>

                {/* ---------------------------Only for Text------------------- */}
                <div className="flex flex-col gap-1">
                    <p className="">Font family</p>
                    <div className="flex gap-2">
                        {
                            strokeWidth.map((val)=>(
                                <div key={val.id} className="w-7 h-7 border rounded-lg bg-gray-700 flex justify-center items-center">
                                    <Minus strokeWidth={val.strokeWidth}/>
                                </div>
                                
                            ))
                        }
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <p className="">Font style</p>
                    <div className="flex gap-2">
                        {
                            strokeWidth.map((val)=>(
                                <div key={val.id} className="w-7 h-7 border rounded-lg bg-gray-700 flex justify-center items-center">
                                    <Minus strokeWidth={val.strokeWidth}/>
                                </div>
                                
                            ))
                        }
                    </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
}