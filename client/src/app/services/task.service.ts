import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

import {EventService} from 'app/services/event.service';
import {ApiError} from 'app/services/commons/api.error';
import {RequestUtils} from 'app/utils/request.utils';
import {Task} from 'app/models/task.model';
import {TaskComment} from 'app/models/task-comment.model';
import {TaskAttachment} from 'app/models/task-attachment.model';

@Injectable()
export class TaskService {

  constructor(private eventService: EventService, private http: HttpClient) {

  }

  public getTask(id: string): Observable<Task> {
    const httpUrl = RequestUtils.getApiUrl(`/tasks/${id}`);
    return this.http.get<Task>(httpUrl, RequestUtils.getJsonOptions()).pipe(
      map((taskData: Task) => new Task(taskData)),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public updateTask(task: Task, data: any): Observable<Task> {
    const httpUrl = RequestUtils.getApiUrl(`/tasks/${task.id}`);
    return this.http.put<Task>(httpUrl, data, RequestUtils.getJsonOptions()).pipe(
      map((taskData: Task) => new Task(taskData)),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public addTaskComment(task: Task, text: string): Observable<TaskComment> {
    const httpUrl = RequestUtils.getApiUrl(`/tasks/${task.id}/comments`);
    return this.http.post<TaskComment>(httpUrl, {text}, RequestUtils.getJsonOptions()).pipe(
      map((commentData: TaskComment) => new TaskComment(commentData)),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }

  public addTaskAttachment(task: Task, file: File): Observable<TaskAttachment> {
    const httpUrl = RequestUtils.getApiUrl(`/tasks/${task.id}/attachments`);
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<TaskAttachment>(httpUrl, formData, RequestUtils.getOptions()).pipe(
      map((attachmentData: TaskAttachment) => new TaskAttachment(attachmentData)),
      catchError((err: HttpErrorResponse) => {
        const apiError = ApiError.withResponse(err);
        this.eventService.publish(EventService.EVENT_API_ERROR, apiError);
        return throwError(apiError);
      })
    );
  }
}