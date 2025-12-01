export interface QuizStatsDTO{
    quizID: string,
    totalAttempts: number,
    participants: number,
    completionRate: number,
    averageScore: number,
    highestScore: number,
    lowestScore: number,
    passRate: number,
    averageTimeTaken: number
}