import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {IconButton,Stack} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";

const cardStyles = {
  overflow: "hidden",
  border: "1px solid",
  borderColor: "rgba(21, 61, 113, 0.1)",
  borderRadius: { xs: 3, md: 4 },
  boxShadow: "0 16px 45px rgba(21, 61, 113, 0.08)",
  bgcolor: "background.paper",
};

export function DegreePage({ children }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(21, 61, 113, 0.045) 0, rgba(255,255,255,0) 420px)",
        py: { xs: 2, md: 4 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "grid", gap: { xs: 2.5, md: 3.5 } }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
}

export function DegreeHero({
  image,
  title,
  subtitle = "Universidad Tecnológica Nacional",
}) {
  const navigate = useNavigate();
  return (
    <Box
      component="header"
      sx={{
        position: "relative",
        minHeight: { xs: 200, sm: 340, md: 420 },
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden",
        borderRadius: { xs: 3, md: 5 },
        backgroundImage: `linear-gradient(180deg, rgba(5, 20, 42, 0.1) 25%, rgba(23, 57, 108, 0.15) 100%), url("${image}")`,
        backgroundSize: {xs:"cover",md:"cover"},
        backgroundPosition: "center",
        boxShadow: "0 22px 55px rgba(21, 61, 113, 0.18)",
      }}
    >
        <IconButton
          size="small"
          onClick={() => navigate("/JPA")}
          sx={{
            position:"absolute",
            bottom:{xs:150,sm:270,lg:370},
            left:10,
            height:40,
            width:40,
            color: "black",
            bgcolor: "rgba(255,255,255,0.55)",
            "&:hover": {
              color: "gray",
              bgcolor: "rgba(255,255,255,0.12)",
            },
          }}
        >
          <ArrowBackIcon fontSize="medium" />
        </IconButton>
      <Box
        sx={{ position: "relative", zIndex: 1, p: { xs: 2.5, sm: 4, md: 5 } }}
      >

        <Typography
          sx={{
            mb: 0.75,
            color: "rgba(255,255,255,0.8)",
            fontSize: { xs: "0.75rem", sm: "0.82rem" },
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {subtitle}
        </Typography>
        <Typography
          component="h1"
          sx={{
            color: "white",
            fontFamily: "Poppins, sans-serif",
            fontSize: { xs: "2rem", sm: "2.75rem", md: "3.5rem" },
            fontWeight: 750,
            lineHeight: 1.08,
            textShadow: "0 3px 18px rgba(0,0,0,0.25)",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
}

export function DegreeSection({ title, icon: Icon, children, contentSx }) {
  return (
    <Card component="section" sx={cardStyles}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.75,
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 2.5 },
        }}
      >
        {Icon && (
          <Box
            sx={{
              width: 46,
              height: 46,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              color: "white",
              background: "var(--primary)",
              borderRadius: 2.25,
              boxShadow: "0 8px 20px rgba(21, 61, 113, 0.18)",
            }}
          >
            <Icon sx={{ fontSize: 25 }} />
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h2"
            sx={{
              color: "var(--primary)",
              fontFamily: "Poppins, sans-serif",
              fontSize: { xs: "1.35rem", sm: "1.65rem" },
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Box

            sx={{
              width: 42,
              height: 3,
              mt: 0.8,
              borderRadius: 10,
              background: "var(--primary)",
            }}
          />
        </Box>
      </Box>
      <CardContent
        sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.5 }, ...contentSx }}
      >
        {children}
      </CardContent>
    </Card>
  );
}

function ExpandableBulletItem({ item, index, numbered, collapsible }) {
  const [expanded, setExpanded] = useState(false);
  const generatedId = useId();
  const canExpand = collapsible && item.length > 360;
  const contentId = `degree-list-item-${generatedId}`;

  return (
    <ListItem
      disableGutters
      alignItems="flex-start"
      sx={{
        gap: 1.5,
        p: { xs: 1.25, sm: 1.5 },
        borderRadius: 2,
        "&:nth-of-type(odd)": { bgcolor: "rgba(21, 61, 113, 0.035)" },
      }}
    >
      <Box
        sx={{
          mt: 0.15,
          width: numbered ? 28 : 24,
          height: numbered ? 28 : 24,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          color: "var(--primary)",
          bgcolor: "rgba(21, 61, 113, 0.09)",
          borderRadius: "50%",
          fontSize: "0.78rem",
          fontWeight: 700,
        }}
      >
        {numbered ? (
          index + 1
        ) : (
          <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
        )}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          id={contentId}
          sx={{
            color: "text.secondary",
            lineHeight: 1.7,
            ...(!expanded &&
              canExpand && {
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
              }),
          }}
        >
          {item}
        </Typography>
        {canExpand && (
          <Button
            size="small"
            onClick={() => setExpanded((current) => !current)}
            aria-expanded={expanded}
            aria-controls={contentId}
            endIcon={
              <ExpandMoreRoundedIcon
                sx={{
                  transition: "transform 180ms ease",
                  transform: expanded ? "rotate(180deg)" : "none",
                }}
              />
            }
            sx={{
              minWidth: 0,
              mt: 0.75,
              px: 0,
              color: "var(--primary)",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "transparent", opacity: 0.78 },
            }}
          >
            {expanded ? "Ver menos" : "Leer más"}
          </Button>
        )}
      </Box>
    </ListItem>
  );
}

export function DegreeBulletList({
  items,
  numbered = false,
  collapsible = false,
}) {
  return (
    <List disablePadding sx={{ display: "grid", gap: 1 }}>
      {items.map((item, index) => (
        <ExpandableBulletItem
          key={item}
          item={item}
          index={index}
          numbered={numbered}
          collapsible={collapsible}
        />
      ))}
    </List>
  );
}

export function DegreeVideo({ src, title }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        pt: "56.25%",
        overflow: "hidden",
        borderRadius: 2.5,
        bgcolor: "grey.900",
      }}
    >
      <CardMedia
        component="iframe"
        title={title}
        src={src}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </Box>
  );
}
