"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import materialService from "@/components/service/materialService";
import GeneratedContentCard from "@/components/ui/generatedCard";
import generateService from "@/components/service/generateService";

interface UploadedFile {
  _id: string;
  name: string;
}

interface GenData {
  topic: string;
  number: string;
  tone: string;
  files: string[];
}

function CreateItemComponent() {
  const { getToken } = useAuth();
  const router = useRouter();

  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId");
  const moduleId = searchParams.get("moduleId");

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [itemType, setItemType] = useState<"quiz" | "assignment">("quiz");
  const [prompt, setPrompt] = useState("");
  const [genData, setGenData] = useState<GenData>({
    topic: "",
    number: "",
    tone: "",
    files: [],
  });
  const [responseData, setResponseData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeTokenAndFetchNotes = async () => {
      try {
        // fetch the uploaded files for this course
        const data = await materialService.getByCourseId(
          await getToken(),
          courseId as string,
        );

        setUploadedFiles(data || []);
      } catch (error) {
        console.error("Error initializing dashboard:", error);
      }
    };

    initializeTokenAndFetchNotes();
  }, []);

  const handleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId],
    );
  };

  const handleGenDataChange = (field: keyof GenData, value: string) => {
    setGenData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    // In a real application, you would send this data to your backend
    setLoading(true);
    const res = await generateService.generateItem(await getToken(),
      itemType,
      genData.topic,
      genData.number,
      genData.tone,
      prompt,
    );

    if (res?.status) {
      // Check if the response status indicates success
      setResponseData(res.data.quiz || res.data.assignment); // Set the quiz data to state

    } else {
      console.error(`ailed to generate ${itemType}:`, res);
    }

    setLoading(false);
  };

  const handleExport = () => {
    console.log("Exporting data:", responseData);
    // Add export logic if needed
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full bg-white shadow-lg">
          <CardHeader className="bg-black text-white">
            <CardTitle className="text-2xl font-bold">
              Create New {itemType === "quiz" ? "Quiz" : "Assignment"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div>
              <h3 className="text-lg font-semibold text-black mb-3">
                Select Files
              </h3>
              <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                {uploadedFiles.map((file) => (
                  <div key={file._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`file-${file._id}`}
                      checked={selectedFiles.includes(file._id)}
                      onCheckedChange={() => handleFileSelection(file._id)}
                      className="border-black text-white"
                    />
                    <Label
                      htmlFor={`file-${file._id}`}
                      className="text-black cursor-pointer"
                    >
                      {file.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-black mb-3">
                Item Type
              </h3>
              <RadioGroup
                defaultValue="quiz"
                onValueChange={(value) =>
                  setItemType(value as "quiz" | "assignment")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quiz" id="quiz" />
                  <Label htmlFor="quiz" className="text-black">
                    Quiz
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="assignment" id="assignment" />
                  <Label htmlFor="assignment" className="text-black">
                    Assignment
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
              <Card className="w-full transition-colors relative bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-black">
                    Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic" className="text-black">
                      Topic
                    </Label>
                    <Input
                      id="topic"
                      value={genData.topic}
                      onChange={(e) =>
                        handleGenDataChange("topic", e.target.value)
                      }
                      className="border-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number" className="text-black">
                      Number of Questions
                    </Label>
                    <Input
                      id="number"
                      type="number"
                      value={genData.number}
                      onChange={(e) =>
                        handleGenDataChange("number", e.target.value)
                      }
                      className="border-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone" className="text-black">
                      Difficulty Level
                    </Label>
                    <Input
                      id="tone"
                      value={genData.tone}
                      onChange={(e) =>
                        handleGenDataChange("tone", e.target.value)
                      }
                      className="border-black"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Label
                htmlFor="prompt"
                className="text-lg font-semibold text-black block mb-2"
              >
                Prompt
              </Label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px] border-black text-black"
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
              disabled={loading} // Disable the button while loading
            >
              {!loading ? (
                "Generate"
              ) : (
                <span className="flex items-center space-x-1">
                  <span>Thinking</span>
                  <span className="animate-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Response Data Card */}
        {responseData && (
          <GeneratedContentCard responseData={responseData} onExport={handleExport} />
        )}
      </div>
    </div>
  );
}

export default function CreateItemPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateItemComponent />
    </Suspense>
  );
}
