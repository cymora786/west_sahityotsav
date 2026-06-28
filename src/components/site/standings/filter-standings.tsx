"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

type Option = { value: string; label: string };

export function FilterStandings({
  divisions,
  categories,
}: {
  divisions: Option[];
  categories: Option[];
}) {
  const router = useRouter();
  const [division, setDivision] = React.useState<string>("");
  const [category, setCategory] = React.useState<string>("");

  const divisionItems = React.useMemo(
    () => Object.fromEntries(divisions.map((option) => [option.value, option.label])),
    [divisions]
  );
  const categoryItems = React.useMemo(
    () => Object.fromEntries(categories.map((option) => [option.value, option.label])),
    [categories]
  );

  const handleApply = () => {
    if (division) {
      router.push(`/division/${division}`);
    } else if (category) {
      router.push(`/categories#${category}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="size-4 text-primary" />
          Filter Standings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Select Division</label>
          <Select items={divisionItems} value={division} onValueChange={(value) => setDivision(value ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Divisions" />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Select Category</label>
          <Select items={categoryItems} value={category} onValueChange={(value) => setCategory(value ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" onClick={handleApply}>
          Apply Filter
        </Button>
      </CardContent>
    </Card>
  );
}
