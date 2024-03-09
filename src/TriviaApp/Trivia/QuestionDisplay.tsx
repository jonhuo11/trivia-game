import { ArrowBack } from "@mui/icons-material";
import {
	Box,
	Card,
	CardContent,
	CardMedia,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Typography,
} from "@mui/material";

interface QuestionDisplayProps {
	q: string;
    img?: string;
	a: string[];
    selected?: number;
    setSelected?: (n:number)=>void;
}

const AlphabetUpper: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
/*
Kahoot style question display main question in the center box, answers below
*/
const QuestionDisplay = ({ q, img, a, selected, setSelected = ()=>{}}: QuestionDisplayProps) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}>
			<Box>
				<Card>
                    {img && <CardMedia 
                        component="img"
                        image={img}
                        alt="Question image"
                        style={{maxHeight: "40vh"}}
                    />}
					<CardContent>
						<Typography textAlign="center">{q}</Typography>
					</CardContent>
				</Card>
			</Box>
			<Box
				sx={{
					width: "100%",
					alignSelf: "flex-start",
				}}>
				<List component="nav">
					{a.map((v, i) => (
						<ListItemButton onClick={() => {setSelected(i)}}>
							<ListItemText
								key={i}
								primary={`${AlphabetUpper[i]}) ${v}`}
							/>
                            {selected == i && <ArrowBack/>}
						</ListItemButton>
					))}
				</List>
			</Box>
		</Box>
	);
};

export default QuestionDisplay;
