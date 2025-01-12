import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuizOption {
    [key: string]: string;
}

interface QuizQuestion {
    mcq: string;
    options: QuizOption;
    correct: string;
}

interface Quiz {
    [key: string]: QuizQuestion;
}

interface Assignments {
    [key: string]: string;
}

interface ResponseData {
    assignments?: Assignments;
    quiz?: Quiz;
}

interface GeneratedContentCardProps {
    responseData: ResponseData;
    onExport: () => void;
}

const GeneratedContentCard: React.FC<GeneratedContentCardProps> = ({ responseData, onExport }) => {
    return (
        <Card className="w-full bg-gray-50 shadow-lg mt-6">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-black">
                    {responseData.assignments ? "Assignments" : "Quiz"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {responseData.assignments ? (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">Assignments:</h3>
                        {Object.entries(responseData.assignments).map(([key, value]) => (
                            <div key={key} className="p-4 bg-gray-100 rounded-md">
                                <p className="font-semibold">Task {key}:</p>
                                <p className="text-sm text-gray-700">{value}</p>
                                <hr className="my-2" />
                            </div>
                        ))}
                    </div>
                ) : responseData.quiz ? (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">Quiz:</h3>
                        {Object.entries(responseData.quiz).map(([key, quizData]) => (
                            <div key={key} className="p-4 bg-gray-100 rounded-md">
                                <p className="font-semibold">Question {key}:</p>
                                <p className="text-sm text-gray-700">{quizData.mcq}</p>
                                <p className="font-semibold mt-2">Options:</p>
                                <ul className="list-disc pl-5">
                                    {Object.entries(quizData.options).map(([optionKey, optionValue]) => (
                                        <li key={optionKey} className="text-gray-700">
                                            <span className="font-semibold">{optionKey.toUpperCase()}:</span> {optionValue}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-sm font-semibold text-green-600 mt-2">
                                    Correct Answer: {quizData.correct.toUpperCase()}
                                </p>
                                <hr className="my-2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-red-500">No data available</p>
                )}
            </CardContent>
            <div className="p-4">
                <Button
                    onClick={onExport}
                    className="w-full bg-black text-white hover:bg-gray-800 transition-colors"
                >
                    Export
                </Button>
            </div>
        </Card>
    );
};

export default GeneratedContentCard;