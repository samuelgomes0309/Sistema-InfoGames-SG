import { Save, Star } from "lucide-react";
import type { GamesProps } from "../../pages/home";

interface Props {
	item: GamesProps;
}
export default function GameInfo({ item }: Props) {
	return (
		<div className="flex min-h-80 flex-col justify-center rounded border border-transparent bg-transparent p-2">
			<img
				className="h-48 w-full rounded object-cover transition-all duration-500 hover:scale-105 hover:cursor-pointer md:h-56 lg:h-64"
				src={item.background_image}
			/>
			<div className="my-2 flex justify-between">
				<span className="line-clamp-1 text-2xl">{item.name}</span>
				<button className="ml-1 cursor-pointer transition-all duration-500 hover:scale-105 hover:text-green-500">
					<Save />
				</button>
			</div>
			<div className="flex w-max gap-2 rounded-full border p-1 px-3 text-yellow-300">
				<span>{item.rating}</span>
				<Star />
			</div>
		</div>
	);
}
