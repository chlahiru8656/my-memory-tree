import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Upload, Sparkles, ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface PlantMemoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const PlantMemoryModal = ({ open, onOpenChange, onSuccess }: PlantMemoryModalProps) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [emotion, setEmotion] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async () => {
    if (!user || !description || !emotion) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    let imageUrl: string | null = null;

    try {
      // Upload image if present
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("memory-images")
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("memory-images")
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      // Insert memory
      const { error: insertError } = await supabase.from("memories").insert({
        user_id: user.id,
        image_url: imageUrl,
        description,
        memory_date: format(date, "yyyy-MM-dd"),
        emotion,
      });

      if (insertError) throw insertError;

      toast.success("Memory planted! 🌱");
      // Reset form
      setFile(null);
      setPreview(null);
      setDescription("");
      setEmotion("");
      setDate(new Date());
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to plant memory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-primary tracking-wide">
            Plant a Memory
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Image Upload */}
          <div>
            <Label className="text-foreground/80 font-body text-sm mb-2 block">
              Memory Image
            </Label>
            <label className="flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors bg-secondary/30 overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="w-8 h-8" />
                  <span className="text-sm font-body">Click to upload an image</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Description */}
          <div>
            <Label className="text-foreground/80 font-body text-sm mb-2 block">
              Description *
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened in this memory?"
              className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
              rows={3}
            />
          </div>

          {/* Date & Emotion row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date Picker */}
            <div>
              <Label className="text-foreground/80 font-body text-sm mb-2 block">Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-body bg-input border-border",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Emotion */}
            <div>
              <Label className="text-foreground/80 font-body text-sm mb-2 block">Emotion *</Label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger className="bg-input border-border text-foreground font-body">
                  <SelectValue placeholder="How did it feel?" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="Happy">😊 Happy</SelectItem>
                  <SelectItem value="Sad">😢 Sad</SelectItem>
                  <SelectItem value="Special">✨ Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !description || !emotion}
            className="w-full bg-primary text-primary-foreground hover:bg-gold-glow font-body tracking-wide"
          >
            {loading ? (
              <Sparkles className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Plant This Memory
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlantMemoryModal;
