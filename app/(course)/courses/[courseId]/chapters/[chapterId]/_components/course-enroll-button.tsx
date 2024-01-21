"use client";

import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import api from "@/lib/api/base";
import {useRouter} from "next/navigation";

interface CourseEnrollButtonProps {
    price: number;
    courseId: string;
}

export const CourseEnrollButton = ({
                                       price,
                                       courseId,
                                   }: CourseEnrollButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const onClick = async () => {
        try {
            setIsLoading(true);
            const res = await api.post(`/api/courses/${courseId}/checkout` )
            router.push(`/courses/${courseId}`)

        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
            size="sm"
            className="w-full md:w-auto"
        >
            Enroll for {formatPrice(price)}
        </Button>
    )
}