import { toast } from "react-toastify";
import { withErrorBoundary } from "components/ErrorBoundary/ErrorBoundary.jsx";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import { Box, Button, Tooltip, Typography, styled } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import MuiDrawer from "@mui/material/Drawer";
import InboxIcon from "@mui/icons-material/Inbox";
import { ChevronRightIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { usePlanContext } from "context/PlanContext";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import {
	PLANS_LIMIT_REACHED,
	PLAN_UNLIMITED,
} from "components/common/constants";
import { useUserContext } from "context/UserContext";
import AddDataDialog from "components/MindMap/AddDataDialog";
import ViewTrainingStatusDialog from "components/MindMap/ViewTrainingStatusDialog";
import { DialogLoader } from "components/common/NewLoader";
import GroundTruthDialog from "components/MindMap/GroundTruth/GroundTruthDialog";

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-start",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const drawerWidth = 270;
const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
	[theme.breakpoints.down("sm")]: {
		width: `0px`,
	},
});
const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));
const useStyles = makeStyles((theme) => ({
	table: {
		maxWidth: 1600,
		// "& .MuiTableCell-root": {
		// 	padding: "14px",
		// },
		"& thead th": {
			position: "sticky",
			top: 0,
			color: "var(--white)",
			backgroundColor: "var(--primary)",
			fontWeight: "bold",
		},
		"& tbody tr:nth-child(even)": {
			backgroundColor: " #2872FA14",
			color: "var(--color5)",
		},
	},
	loading: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: "100px",
	},
	titleContainer: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "column",
		margin: "16px auto",
		maxWidth: 1200,
	},
	pagination: {
		margin: "10px auto",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	tableRow: {
		whiteSpace: "break-spaces",
	},
	action_box: {
		display: "flex",
		flexDirection: "column",
		alignContent: "flex-start",
		marginLeft: "20px",
		height: "9rem",
		justifyContent: "space-evenly",
		flexWrap:"wrap"
	},
	search_container: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "center",
	},
}));

const RightDrawer = ({ isRightDrawerOpened, toggleRightNav, navOptions }) => {
	const classes = useStyles();
	const {
		user: { is_god },
	} = useUserContext();
	const { plan } = usePlanContext();
	async function handleOpenGroundTruthDialog() {
		setOpenGroundTruthDialog(true);
	}
	// Add Dialog
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [total, setTotal] = useState(0);	
	const [data, setData] = useState([]);
	const [openGroundTruthDialog, setOpenGroundTruthDialog] = useState(false);
	const [openTasksDialog, setOpenTasksDialog] = useState(false);
	const [openBucketsDialog, setOpenBucketsDialog] = useState(false);
	
	const handleOpenTasksDialog = async () => {
		setOpenTasksDialog(true);
	};
	async function handleOpenBucketsDialog() {
		setOpenBucketsDialog(true);
	}
	const handleOpenAddDialog = async () => {
		if (plan.training !== PLAN_UNLIMITED && total >= plan.training && !is_god) {
			return toast.info(PLANS_LIMIT_REACHED);
		}
		setOpenAddDialog(true);
	};
	return (
		<Drawer
			variant="permanent"
			anchor="right"
			open={isRightDrawerOpened}
			onClose={toggleRightNav}
		>
			<Tooltip
				title={isRightDrawerOpened ? "Close Right Drawer" : "Open Right Drawer"}
				arrow
			>
				<DrawerHeader>
					<IconButton onClick={toggleRightNav}>
						{isRightDrawerOpened ? <ChevronRightIcon /> : <MenuIcon />}
					</IconButton>
				</DrawerHeader>
			</Tooltip>
			<Divider />
			<Box className={classes.action_box}>
					<Button
						variant="contained"
						color="primary"
						startIcon={<AddIcon />}
						onClick={handleOpenAddDialog}
					>
						<Typography variant="h6" component="span" align="center">
							Add Data
						</Typography>
					</Button>
					<Button
						variant="contained"
						color="secondary"
						startIcon={<HistoryIcon />}
						onClick={handleOpenTasksDialog}
					>
						<Typography variant="h6" component="span" align="center">
							Data Training Status
						</Typography>
					</Button>
					<Button
						variant="outlined"
						color="secondary"
						startIcon={<QuestionAnswerIcon />}
						onClick={handleOpenGroundTruthDialog}
					>
						<Typography variant="h6" component="span" align="center">
							Ground Truths
						</Typography>
					</Button>
					{is_god ? (
						<Button
							variant="outlined"
							startIcon={<InboxIcon />}
							onClick={handleOpenBucketsDialog}
						>
							<Typography variant="h6" component="span" align="center">
								Buckets
							</Typography>
						</Button>
					) : null}
				</Box>
				<Suspense fallback={<></>}>
				<AddDataDialog {...{ openAddDialog, setData, setOpenAddDialog }} />
			</Suspense>
			<Suspense fallback={<></>}>
				<ViewTrainingStatusDialog
					{...{ openTasksDialog, setOpenTasksDialog }}
				/>
			</Suspense>
			<Suspense fallback={<DialogLoader />}>
				{openGroundTruthDialog ? (
					<GroundTruthDialog
						{...{
							openGroundTruthDialog,
							setOpenGroundTruthDialog,
						}}
					/>
				) : null}
			</Suspense>
		</Drawer>
	);
};

export default withErrorBoundary(RightDrawer, "RightDrawer");
