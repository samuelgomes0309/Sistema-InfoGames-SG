import type { GenreProps } from "../../pages/home";

interface Props {
	genre: GenreProps;
	selected: GenreProps | null;
	setSelected: (genre: GenreProps) => void;
}
export default function ItemCategory({ genre, selected, setSelected }: Props) {
	return (
		<div
			onClick={() => setSelected(genre)}
			className={`cursor-pointer border-b-2 transition-all duration-500 hover:border-b-white ${selected?.id === genre.id ? "flex items-center gap-3.5 border-blue-900 p-2 font-semibold text-white" : "flex items-center gap-3.5 border-transparent p-2 text-zinc-500"} `}
		>
			<span>{genre.name}</span>
		</div>
	);
}
