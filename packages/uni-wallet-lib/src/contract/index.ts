import ERC20Abi from "./abis/ERC20.json";
import CourseContractAbi from "./abis/CourseContract.json";
import SimpleYDContractAbi from "./abis/SimpleYDToken.json";
import { Abi } from "viem";

export const ERC20_ABI = ERC20Abi as Abi;
export const COURSE_CONTRACT_ABI = CourseContractAbi as Abi;
export const SIMPLE_YD_TOKEN_ABI = SimpleYDContractAbi as Abi;
