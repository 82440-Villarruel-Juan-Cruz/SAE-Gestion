import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import PublicIcon from "@mui/icons-material/Public";
import SchoolIcon from "@mui/icons-material/School";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { createElement } from "react";

export default function ListEngineer({
  degree,
  duration,
  link,
  intermedio,
  video,
  world,
}) {
  const items = [
    { value: degree, icon: SchoolIcon },
    { value: duration, icon: TimerOutlinedIcon },
    {
      value: video && "Conocé más",
      href: video,
      icon: YouTubeIcon,
      ariaLabel: "Conocé más sobre la carrera",
    },
    {
      value: link && "Visitá la página web del Departamento",
      href: link,
      icon: LanguageOutlinedIcon,
      ariaLabel: "Visitar la página web del Departamento",
    },
    { value: intermedio, icon: WorkOutlineOutlinedIcon },
    { value: world, icon: PublicIcon },
  ].filter(({ value }) => value);

  return (
    <List
      disablePadding
      aria-label="Información de la carrera"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 1.5,
        width: "100%",
        mt: { xs: 2.5, md: 3 },
      }}
    >
      {items.map(({ value, href, icon, ariaLabel }) => (
        <ListItem
          key={href ?? value}
          sx={{
            minWidth: 0,
            alignItems: "center",
            gap: 1.5,
            px: { xs: 1.25, sm: 1.5 },
            py: 1.5,
            border: "1px solid",
            borderColor: "rgba(21, 61, 113, 0.1)",
            borderRadius: 2.5,
            bgcolor: "background.paper",
            boxShadow: "0 4px 14px rgba(21, 61, 113, 0.05)",
            transition:
              "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
            "&:hover": {
              transform: "translateY(-2px)",
              borderColor: "rgba(21, 61, 113, 0.25)",
              boxShadow: "0 8px 22px rgba(21, 61, 113, 0.1)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              width: 44,
              height: 44,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              color: "var(--primary)",
              bgcolor: "rgba(21, 61, 113, 0.08)",
              borderRadius: 2,
            }}
          >
            {createElement(icon, { sx: { fontSize: 26 } })}
          </ListItemIcon>

          <Typography
            component="div"
            sx={{
              minWidth: 0,
              color: "text.primary",
              fontSize: { xs: "1rem", sm: "1.075rem" },
              lineHeight: 1.45,
              fontWeight: 500,
            }}
          >
            {href ? (
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={ariaLabel}
                underline="none"
                sx={{
                  color: "inherit",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  "&:hover": { color: "var(--primary)" },
                  "&:focus-visible": {
                    borderRadius: 0.5,
                    outline: "2px solid var(--primary)",
                    outlineOffset: 3,
                  },
                }}
              >
                {value}
                <OpenInNewRoundedIcon
                  sx={{ fontSize: 17, flexShrink: 0, opacity: 0.7 }}
                />
              </Link>
            ) : (
              value
            )}
          </Typography>
        </ListItem>
      ))}
    </List>
  );
}
