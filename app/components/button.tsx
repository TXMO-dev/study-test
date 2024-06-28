"use client";
import {
	Button as ChaButton,
	ButtonProps as ChaButtonProps,
} from "@chakra-ui/react";
import Link from "next/link";

interface ButtonProps extends ChaButtonProps {
	text?: string;
	path?: string;
	onClick?(): void;
	bg?: string;
	color?: string;
	borderColor?: string;
	p?: string;
	mt?: string;
	mr?: string;
	leftIcon?: any;
	h?: string;
	w?: string;
	isLoading?:boolean
	maxW?: string;
	fontSize?: string;
	variant?: "primary" | "secondary" | "tertiary" | "transparent";
}
import { BeatLoader } from 'react-spinners';


export const Button: React.FC<ButtonProps> = ({
	w,
	h,
	mr,
	text,
	leftIcon,
	path,
	onClick,
	bg,
	color,
	isLoading,
	mt,
	borderColor,
	p,
	maxW,
	variant = "transparent",
	as,
	border,
	fontSize,
}) => {
	const isPrimary = variant === "primary";
	const isSecondary = variant === "secondary";
	const isTertiary = variant === "tertiary";

	return (
		<ChaButton
			isLoading={isLoading ? true : false}
  		spinner={<BeatLoader size={8} color='white' />}
			as={as ? as : Link}
			href={path}
			onClick={onClick}
			fontSize={fontSize ? fontSize : "14px"}
			h={h ? h : isPrimary || isSecondary || isTertiary ? "48px" : "56px"}
			w={w ? w : "145"}
			p={p ? p : "1.5em"}
			_hover={{
				bgColor: "none",
			}}
			_active={{
				bgColor: "none",
			}}
			border={border ? border : "2px solid"}
			borderColor={
				borderColor
					? borderColor
					: isPrimary || isSecondary || isTertiary
					? "brand.blue"
					: "purple.500"
			}
			color={
				color
					? color
					: isPrimary
					? "white"
					: isSecondary || isTertiary
					? "brand.blue"
					: "purple.500"
			}
			bgColor={bg ? bg : isPrimary ? "brand.blue" : "transparent"}
			mt={mt ? mt : "2rem"}
			mr={mr ? mr : undefined}
			leftIcon={leftIcon}
			maxW={maxW ? maxW : "462px"}>
			{text}
		</ChaButton>
	);
};
