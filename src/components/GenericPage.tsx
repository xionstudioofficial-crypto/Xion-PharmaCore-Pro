import { motion } from "motion/react";
import { Search, Plus } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export function GenericPage({ title, description }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-700 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-emerald-800 transition">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="text" placeholder={`Search ${title.toLowerCase()}...`} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-1 focus:ring-emerald-700 outline-none" />
            </div>
        </div>
        <p className="text-gray-500 text-center py-12">The {title.toLowerCase()} database will be displayed here.</p>
      </div>
    </motion.div>
  );
}
