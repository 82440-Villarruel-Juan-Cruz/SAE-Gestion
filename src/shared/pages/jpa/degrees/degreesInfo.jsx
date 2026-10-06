import SAEPage from "../../../components/page/SAEPage";
import { Box,Chip,Stack} from "@mui/material";
import { SAETypography } from "../../../components/typography/SAETypography";

import SchoolIcon from '@mui/icons-material/School';
import SAEButton from "../../../components/buttons/SAEButton";
const baseUrl = import.meta.env.BASE_URL;
export default function DegreesInfoPage({banner,title,subtitle}){

    return(
        <SAEPage>
            <HeroDegree image={banner} title={title} subtitle={subtitle}/>
        </SAEPage>
    );
}
function HeroDegree({image,title,subtitle}){
    //console.log(`url(${baseUrl}${image})`);
    return(
        
        <Box
        sx={{
            position: 'relative', 
            height: {xs:"55vh",lg:"75vh"},
            backgroundImage: `url(${baseUrl}${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            textAlign:"center"
        }}
        >
            <Box
                sx={{
                position: 'absolute',
                px:{xs:1,md:6},
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.65)', 
                }}
            >
                <Stack
                    justifyContent="center"
                    height="100%"
                    spacing={{xs:1,md:4}}
                >
                <Chip
                    icon={<SchoolIcon />}
                    label="Universidad Tecnológica Nacional - Córdoba"
                    sx={{
                        width: "fit-content",
                        bgcolor: "rgba(255,255,255,.15)",
                        color: "white",
                        backdropFilter: "blur(10px)",
                        fontWeight: 600,
                    }}
                    />

                    <SAETypography
                        variant="h1"
                    >
                    {title}
                    </SAETypography>

                    <SAETypography
                        variant = "caption"
                    >
                    {subtitle}

                    </SAETypography>
                    <Stack
                    textAlign={"center"}
                    direction={"row"}
                    width={"100%"}
                    spacing={{xs:1,md:2}}
                    >
                    <SAEButton
                        variant="contained"
                        size="large"
                        
                        sx={{
                            bgcolor: "var(--green)"
                        }}
                    >
                        Ver el plan
                    </SAEButton>
                    
                    <SAEButton
                        variant="contained"
                        size="large"
                        sx={{
                            bgcolor: "var(--orange)"
                        }}
                    >
                        Inscribirme Ya
                    </SAEButton>
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
}